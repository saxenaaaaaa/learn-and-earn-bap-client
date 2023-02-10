
import moment from "moment";
import { v4 as uuid } from "uuid";
import onsearchResponse from './mock/onSearchResponse.json'
import initRequest from './mock/initRequest.json'
export const buildContext = (input: any = {}) => {
    return {
        domain: process.env.DOMAIN + input?.category,
        action: input?.action ?? "",
        location: { city: { code: process.env.CITY || (input?.city ?? "") }, country: { code: process.env.COUNTRY || (input?.country ?? "") } },
        core_version: process.env.CORE_VERSION || (input?.core_version ?? ""),
        bap_id: process.env.BAP_ID || (input?.bapId ?? ""),
        bap_uri: process.env.BAP_URI || (input?.bapUri ?? ""),
        bpp_id: (input?.bppId ?? ""),
        bpp_uri: (input?.bppUri ?? ""),
        transaction_id: input?.transactionId ?? uuid(),
        message_id: input?.messageId ?? uuid(),
        timestamp: input.timestamp ?? moment().toISOString(),
    }
}

export const isAcknowledged = (input: any = {}) => {
    return (input?.message?.ack?.status === "ACK")
}

export const buildSearchRequest = (input: any = {}) => {
    const context = buildContext({ category: 'jobs', action: 'search' });
    const intent: any = {}
    if (input?.titles?.[0].key) {
        intent.item = { "descriptor": { "name": input?.titles?.[0].key } }
    }

    if (input?.companies?.[0].name) {
        intent.provider = { "descriptor": { "name": input?.companies?.[0].name } }
    }

    if (input?.companies?.[0].locations) {
        intent.provider = { locations: input?.companies?.[0]?.locations }
    }

    if (input?.skills?.length) {
        intent.fulfillment = { customer: { person: { skills: input?.skills } } };
    }

    const message = { intent: intent };

    return { payload: { context, message } };
}

export const buildSearchResponse = (input: any = {}, body: any = {}) => {
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input;
    const context = { transactionId, messageId, bppId, bppUri };

    return { context, message: input.message };
}

export const buildOnSearchRequest = (input: any = {}) => {
    const context = buildContext({ category: 'jobs', action: 'on_search', transactionId: input?.transactionId, messageId: input?.messageId, });
    const message = {};

    return { payload: { context, message } };
}

export const buildOnSearchResponse = (input: any = {}, body: any = {}) => {

    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input.context;
    const context = { transactionId, messageId, bppId, bppUri };

    const providers = input?.message?.catalog?.providers;
    const payments = input?.message?.catalog?.payments;

    const jobs: any[] = [];

    providers?.forEach((provider: any) => {
        provider?.items?.forEach((item: any) => {
            const job: any = {
                jobProvider: provider?.descriptor?.name,
                company: {
                    id: provider?.id,
                    name: provider?.descriptor?.name,
                    image: provider?.descriptor?.images?.map((image: any) => ({ url: image?.url, size: image?.size_type }))
                },
                jobId: item?.id,
                role: item?.descriptor?.name,
                description: item?.descriptor?.long_desc,
                locations: provider?.locations
                    ?.filter((location: any) => item?.location_ids?.find((id: any) => id == location?.id))
                    ?.map((location: any) => ({
                        id: location?.id,
                        city: location?.city?.name,
                        cityCode: location?.city?.code,
                        state: location?.state?.name,
                        country: location?.country?.name,
                        countryCode: location?.country?.code
                    })),
                categories: provider?.categories
                    ?.filter((category: any) => item?.category_ids?.find((id: any) => id == category?.id))
                    ?.map((category: any) => ({ id: category?.id, code: category?.descriptor.code })),

            };

            const compensation: any[] = [];
            payments?.filter((payment: any) => item?.payment_ids?.find((id: any) => payment?.id == id))
                .forEach((payment: any) => {
                    payment?.tags?.find((tag: any) => tag?.descriptor?.name == "compensation_type")
                        ?.list.forEach((li: any) => {
                            compensation?.push({
                                type: li?.descriptor?.code,
                                amount: li?.value,
                                currency: payment?.params?.currency,
                                frequency: payment?.time?.schedule?.frequency
                            });
                        });

                });
            job.compensation = compensation;
            jobs.push(job);
        })
    })

    return { context, jobs };
}

export const buildSelectRequest = (input: any = {}) => {

    const context = buildContext({
        category: "jobs",
        action: 'on_search',
        bppId: input?.context?.bppId,
        bppUri: input?.context?.bppUri,
        transactionId: input?.context?.transactionId,
    });
    const message = {
        order: {
            provider: { id: input?.companyId },
            items: [
                { id: input?.jobId }
            ]
        }
    }

    return { payload: { context, message } }
}

export const buildSelectResponse = (input: any = {}, body: any = {}) => {
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input;
    const context = { transactionId, messageId, bppId, bppUri };

    return { context, message: input?.message };
}

export const buildOnSelectRequest = (input: any = {}) => {
    const context = buildContext({ transactionId: input.transaction_id, messageId: input.message_id, bppId: input.bpp_id, bppUri: input.bpp_uri });
    const message = {};
    return { payload: { context, message } };
}

export const buildOnSelectResponse = (input: any = {}, body: any = {}) => {

    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri }: any = input?.context;
    const context = { transactionId, messageId, bppId, bppUri };

    const provider = input?.message?.order?.provider;
    const items = input?.message?.order?.items;
    const xinput = input?.message?.order?.xinput;

    const company = {
        id: provider?.id,
        name: provider?.descriptor?.name,
        image: provider?.descriptor?.images?.map((image: any) => ({ url: image?.url, size: image?.size_type }))
    }

    const selectedJobs: any[] = [];
    items?.forEach((item: any) => {
        const job: any = {
            jobId: item?.id,
            role: item?.descriptor?.name,
            description: item?.descriptor?.long_desc,
            locations: provider?.locations
                ?.filter((location: any) => item?.location_ids?.find((locationId: any) => location.id == locationId))

                ?.map((location: any) => ({
                    id: location?.id,
                    city: location?.city?.name,
                    cityCode: location?.city?.code,
                    state: location?.state?.name,
                    country: location?.country?.name,
                    countryCode: location?.country?.code
                })),
            fulfillmentCategory: item?.fulfillments
                ?.filter((fulfillment: any) => item?.fulfillment_ids?.find((fulfillmentId: any) => fulfillment?.id == fulfillmentId))
                ?.map((fulfillment: any) => fulfillment),

            educationalQualifications: item?.tags
                ?.filter((tag: any) => tag?.descriptor?.name?.toLowerCase()?.includes('qualifications'))
                ?.map((tag: any) => ({
                    category: tag?.descriptor?.name,
                    qualification: tag?.descriptor?.list?.map((li: any) => ({ code: li?.descriptor?.code, name: li?.descriptor?.name, value: li?.value }))
                }))
        };

        const workExperience = item?.tags?.find((tag: any) => tag?.descriptor?.name?.toLowerCase() == "work experience");
        const employmentInformation = item?.tags?.find((tag: any) => tag?.descriptor?.code == "employment-info");
        const compensation = item?.tags?.find((tag: any) => tag?.descriptor?.code == "salary-info");

        job.workExperience = {
            key: workExperience?.descriptor?.name,
            experience: workExperience?.descriptor?.list?.map((li: any) => ({ code: li?.descriptor?.code, name: li?.descriptor?.name, value: li?.value }))
        }
        job.employmentInformation = {
            code: employmentInformation?.descriptor?.code,
            name: employmentInformation?.descriptor?.name,
            employmentInfo: {
                code: employmentInformation?.descriptor?.list?.[0]?.descriptor?.code,
                name: employmentInformation?.descriptor?.list?.[0]?.descriptor?.name,
                value: employmentInformation?.descriptor?.list?.[0]?.value
            }
        }
        job.compensation = {
            code: compensation?.descriptor?.code,
            name: compensation?.descriptor?.name,
            salaryInfo: compensation?.descriptor?.list?.map((li: any) => ({ code: li?.descriptor?.code, name: li?.descriptor?.name, value: li?.value })),
        }

        job.additionalFormUrl = xinput?.form?.url

        selectedJobs.push(job);
    });

    return { context, company, selectedJobs };
}


export const buildInitRequest = (input: any = initRequest) => {
    const context = buildContext({
        category: "jobs",
        action: 'init',
        bppId: input?.context?.bppId,
        bppUri: input?.context?.bppUri,
        transactionId: input?.context?.transactionId,
    });
    const message = {
        order: {
            provider: { id: input?.companyId },
            items: [
                { id: input?.jobs.jobId }
            ],
            fulfillments: input.jobFulfillments.map((data: any) => {
                return {
                    id: data?.JobFulfillmentCategoryId,
                    customer: {
                        person: {
                            name: data?.jobApplicantProfile?.name,
                            languages: data?.jobApplicantProfile?.languages?.map((language: any) => {
                                return language
                            }),
                            URL: data?.jobApplicantProfile?.profileUrl,
                            creds: {
                                url: data?.jobApplicantProfile?.creds?.url,
                                type: data?.jobApplicantProfile?.creds?.type
                            },
                            skills: data?.jobApplicantProfile?.skills?.map((skill: any) => {
                                return skill
                            }),
                        }
                    }
                }
            }),
            xinput: input?.xinput
        },
    }
    return { payload: { context, message } }
}

export const buildInitResponse = (input: any = {}, body: any = {}) => {
    return input;
}

export const buildOnInitRequest = (input: any = {}) => {
    const context = buildContext({ category: 'jobs', action: 'on_init', transactionId: input?.transactionId, messageId: input?.messageId, bppId: input?.bppId, bppUri: input.bppUri });
    const message = {};

    return { payload: { context, message } };
}

export const buildOnInitResponse = (input: any = {}, body: any = {}) => {
    return input;
}

export const buildConfirmRequest = (input: any = {}) => {
    const context = buildContext({
        category: "jobs",
        action: 'confirm',
        bppId: input?.context?.bppId,
        bppUri: input?.context?.bppUri,
        transactionId: input?.context?.transactionId,
    });
    const message = {
        order: {
            provider: { id: input?.companyId },
            items: [
                { id: input?.jobId }
            ],
            fulfillments: [{
                id: input?.jobApplicantProfile.id,
                customer: {
                    person: {
                        name: input.jobApplicantProfile.name,
                        languages: input.jobApplicantProfile.languages,
                        URL: input.jobApplicantProfile.url,
                        creds: input.jobApplicantProfile.creds.map((cred: any) => {
                            return cred
                        }),
                        skills: input.jobApplicantProfile.skills.map((skill: any) => {
                            return skill
                        }),
                    }
                }
            }],
            xinput: input?.xinput
        },
    }

    return { payload: { context, message } }
}

export const buildConfirmResponse = (input: any = {}, body: any = {}) => {
    return input;
}

export const buildOnConfirmRequest = (input: any = {}) => {
    const context = buildContext({ category: 'jobs', action: 'on_confirm', transactionId: input?.transactionId, messageId: input?.messageId, bppId: input?.bppId, bppUri: input.bppUri });
    const message = {};

    return { payload: { context, message } };
}

export const buildOnConfirmResponse = (input: any = {}) => {
    const context = buildContext({ category: 'jobs', action: 'on_confirm', transactionId: input?.transactionId, messageId: input?.messageId, bppId: input?.bppId, bppUri: input.bppUri });
    const message = input?.message

    return { payload: { context, message } };
}

export const buildError = (input: any = {}) => {
    return {
        code: "404",
        message: input.message,
        data: input.data,
        type: "Application error",
        path: input.path
    }
}
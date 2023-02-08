
import { v4 as uuid } from "uuid";

export const buildContext = (input: any = {}) => {
    return {
        domain: process.env.DOMAIN + input?.category,
        country: process.env.COUNTRY || (input?.country ?? ""),
        city: process.env.CITY || (input?.city ?? ""),
        action: input?.action ?? "",
        core_version: process.env.CORE_VERSION || (input?.core_version ?? ""),
        bap_id: process.env.BAP_ID || (input?.bapId ?? ""),
        bap_uri: process.env.BAP_URI || (input?.bapUri ?? ""),
        bpp_id: (input?.bppId ?? ""),
        bpp_uri: (input?.bppUri ?? ""),
        transaction_id: input?.transactionId ?? uuid(),
        message_id: input?.messageId ?? uuid(),
        timestamp: input.timestamp ?? Date.now(),
    }
}

export const buildSearchRequest = (input: any = {}) => {
    const context = buildContext({ category: 'jobs', action: 'search' });
    const intent: any = {}
    if (input?.titles?.[0].key) {
        intent.item = {
            "descriptor": { "name": input?.titles?.[0].key }
        }
    }

    if (input?.companies?.[0].name) {
        intent.provider = {
            "descriptor": { "name": input?.companies?.[0].name },
        }
    }

    if (input?.companies?.[0].locations) {
        intent.provider = { locations: input?.companies?.[0]?.locations }
    }


    if (input?.skills?.length) {
        intent.fulfillment.customer.person.skills = input?.skills;
    }

    const message = { intent: intent };

    return { payload: { context, message } };
}

export const buildSearchResponse = (input: any = {}) => {
    return input;
}

export const buildOnSearchRequest = (input: any = {}) => {
    const context = buildContext({ category: 'jobs', action: 'on_search', transactionId: input?.transactionId, messageId: input?.messageId, });
    const message = {};

    return { payload: { context, message } };
}

export const buildOnSearchResponse = (input: any = {}) => {

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

    delete input.message;
    return { ...input, jobs };
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

export const buildSelectResponse = (input: any = {}) => {
    return input;
}

export const buildOnSelectRequest = (input: any = {}) => {
    const context = buildContext();
    return { payload: { context } };
}

export const buildOnSelectResponse = (input: any = {}) => {
    return input;
}


export const buildInitRequest = (input: any = {}) => {
    const context = buildContext();
    return { payload: { context } };
}

export const buildInitResponse = (input: any = {}) => {
    return input;
}

export const buildOnInitRequest = (input: any = {}) => {
    const context = buildContext();
    return { payload: { context } };
}

export const buildOnInitResponse = (input: any = {}) => {
    return input;
}

export const buildConfirmRequest = (input: any = {}) => {
    const context = buildContext();
    return { payload: { context } };
}

export const buildConfirmResponse = (input: any = {}) => {
    return input;
}

export const buildOnConfirmRequest = (input: any = {}) => {
    const context = buildContext();
    return { payload: { context } };
}

export const buildOnConfirmResponse = (input: any = {}) => {
    return input;
}

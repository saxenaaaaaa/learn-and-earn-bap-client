
export const searchJobMessageBuilder = (body: any) => {
    const intent: any = {}
    if (body?.titles?.[0].key) {
        intent.item = {
            "descriptor": {
                "name": body?.titles?.[0].key
            }
        }
    }

    if (body?.companies?.[0].name) {
        intent.provider = {
            "descriptor": {
                "name": body?.companies?.[0].name
            },
        }
    }

    if (body?.companies?.[0].locations) {
        intent.provider = { locations: body?.companies?.[0].locations }
    }


    if (body?.skills?.length) {
        intent.tags = [{
            code: "Skills",
            name: "",
            list: body?.skills?.map((skill: any) => { return { code: skill.skill } })
        }]
    }
    const message = { message: { intent: intent } }
    return message
}

export const selectJobMessageBuilder = (body: any) => {
    return {}
}

export const initJobMessageBuilder = (body: any) => {
    return {}
}

export const confirmMessageBuilder = (body: any) => {
    return {}
}

export const buildSelectRequest = (input: any) => {
    return {
        context: {
            domain: "dsep:jobs",
            version: "1.0.0",
            bap_id: "https://examplebap.io/",
            bap_uri: input?.context?.bppUri,
            bpp_id: input?.context?.bppId,
            bpp_uri: "http://affinidibpp.com/path/to/endpoint",
            transaction_id: input?.context?.transactionId,
            message_id: input?.context?.transactionId,
            timestamp: Date.now(),
        },
        message: {
            order: {
                provider: {
                    id: input?.companyId
                },
                items: [{
                    id: input?.jobId
                }]
            }
        }
    }
}

export const onSearchResponseBuilder = (input: any = {}) => {

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

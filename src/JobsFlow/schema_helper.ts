
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

export const onSearchResponseBuilder = (resp: any) => {

    const data = resp.message.catalog.provider.map((provider: any) => {
        return {
            providerId: provider,
            providerName: provider.descriptor.name,
            providerImgUrl: provider.descriptor.images.url,
            jobid: provider.item.id
        }
    })
    return {
        "jobs": [
            {
                "jobProvider": resp.message.catalog.descriptor.name,
                "company": {
                    "id": data.providerId,
                    "name": data.providerName,
                    "imageLink": [
                        {
                            "url": data.providerImgUrl,
                            "size": "string"
                        }
                    ]
                },
                "jobId": "string",
                "role": "string",
                "description": "string",
                "locations": [
                    {
                        "id": "string",
                        "city": "string",
                        "cityCode": "string",
                        "state": "string",
                        "country": "string",
                        "countryCode": "string"
                    }
                ],
                "categories": [
                    {
                        "id": "string",
                        "code": "string"
                    }
                ],
                "compensation": [
                    {
                        "type": "fixed",
                        "amount": 0,
                        "currency": "string",
                        "frequency": "string"
                    }
                ]
            }
        ]
    }
}

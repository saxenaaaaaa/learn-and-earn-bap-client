
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

export const OnInitJobMessageBuilder = (body: any) => {
    return {}
}

export const OnSelectJobMessageBuilder = (body: any) => {
    return {}
}

export const OnConfirmJobMessageBuilder = (body: any) => {
    return {}
}

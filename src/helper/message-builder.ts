const messageBody = { message: {} }
export const messageBuilder = (body: any) => {
    if (body.title) {
        messageBody.message = {
            intent: {
                item: { descriptor: { name: body.title } }
            }
        }
    }
    if (body.title && body.skills) {
        messageBody.message = {
            intent: {
                item: [
                    {
                        descriptor: {
                            name: body.title
                        },
                        tags: [
                            {
                                code: body.skills,
                                "name": "",
                                "list": [
                                    {
                                        "code": "flutter"
                                    },
                                    {
                                        "code": "kotlin"
                                    },
                                    {
                                        "code": "architecture"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

        }
    }
}




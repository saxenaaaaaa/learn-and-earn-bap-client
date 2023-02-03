"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageBuilder = void 0;
const messageBody = { message: {} };
const messageBuilder = (body) => {
    if (body.title) {
        messageBody.message = {
            intent: {
                item: { descriptor: { name: body.title } }
            }
        };
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
        };
    }
};
exports.messageBuilder = messageBuilder;

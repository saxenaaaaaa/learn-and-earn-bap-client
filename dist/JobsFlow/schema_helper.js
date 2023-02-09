"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildError = exports.buildOnConfirmResponse = exports.buildOnConfirmRequest = exports.buildConfirmResponse = exports.buildConfirmRequest = exports.buildOnInitResponse = exports.buildOnInitRequest = exports.buildInitResponse = exports.buildInitRequest = exports.buildOnSelectResponse = exports.buildOnSelectRequest = exports.buildSelectResponse = exports.buildSelectRequest = exports.buildOnSearchResponse = exports.buildOnSearchRequest = exports.buildSearchResponse = exports.buildSearchRequest = exports.buildContext = void 0;
const uuid_1 = require("uuid");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return {
        domain: process.env.DOMAIN + (input === null || input === void 0 ? void 0 : input.category),
        country: process.env.COUNTRY || ((_a = input === null || input === void 0 ? void 0 : input.country) !== null && _a !== void 0 ? _a : ""),
        city: process.env.CITY || ((_b = input === null || input === void 0 ? void 0 : input.city) !== null && _b !== void 0 ? _b : ""),
        action: (_c = input === null || input === void 0 ? void 0 : input.action) !== null && _c !== void 0 ? _c : "",
        core_version: process.env.CORE_VERSION || ((_d = input === null || input === void 0 ? void 0 : input.core_version) !== null && _d !== void 0 ? _d : ""),
        bap_id: process.env.BAP_ID || ((_e = input === null || input === void 0 ? void 0 : input.bapId) !== null && _e !== void 0 ? _e : ""),
        bap_uri: process.env.BAP_URI || ((_f = input === null || input === void 0 ? void 0 : input.bapUri) !== null && _f !== void 0 ? _f : ""),
        bpp_id: ((_g = input === null || input === void 0 ? void 0 : input.bppId) !== null && _g !== void 0 ? _g : ""),
        bpp_uri: ((_h = input === null || input === void 0 ? void 0 : input.bppUri) !== null && _h !== void 0 ? _h : ""),
        transaction_id: (_j = input === null || input === void 0 ? void 0 : input.transactionId) !== null && _j !== void 0 ? _j : (0, uuid_1.v4)(),
        message_id: (_k = input === null || input === void 0 ? void 0 : input.messageId) !== null && _k !== void 0 ? _k : (0, uuid_1.v4)(),
        timestamp: (_l = input.timestamp) !== null && _l !== void 0 ? _l : Date.now(),
    };
};
exports.buildContext = buildContext;
const buildSearchRequest = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'search' });
    const intent = {};
    if ((_a = input === null || input === void 0 ? void 0 : input.titles) === null || _a === void 0 ? void 0 : _a[0].key) {
        intent.item = {
            "descriptor": { "name": (_b = input === null || input === void 0 ? void 0 : input.titles) === null || _b === void 0 ? void 0 : _b[0].key }
        };
    }
    if ((_c = input === null || input === void 0 ? void 0 : input.companies) === null || _c === void 0 ? void 0 : _c[0].name) {
        intent.provider = {
            "descriptor": { "name": (_d = input === null || input === void 0 ? void 0 : input.companies) === null || _d === void 0 ? void 0 : _d[0].name },
        };
    }
    if ((_e = input === null || input === void 0 ? void 0 : input.companies) === null || _e === void 0 ? void 0 : _e[0].locations) {
        intent.provider = { locations: (_g = (_f = input === null || input === void 0 ? void 0 : input.companies) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.locations };
    }
    if ((_h = input === null || input === void 0 ? void 0 : input.skills) === null || _h === void 0 ? void 0 : _h.length) {
        intent.fulfillment = { customer: { person: { skills: input === null || input === void 0 ? void 0 : input.skills } } };
    }
    const message = { intent: intent };
    return { payload: { context, message } };
};
exports.buildSearchRequest = buildSearchRequest;
const buildSearchResponse = (input = {}) => {
    return input;
};
exports.buildSearchResponse = buildSearchResponse;
const buildOnSearchRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_search', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnSearchRequest = buildOnSearchRequest;
const buildOnSearchResponse = (input = {}) => {
    var _a, _b, _c, _d;
    const providers = (_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.catalog) === null || _b === void 0 ? void 0 : _b.providers;
    const payments = (_d = (_c = input === null || input === void 0 ? void 0 : input.message) === null || _c === void 0 ? void 0 : _c.catalog) === null || _d === void 0 ? void 0 : _d.payments;
    const jobs = [];
    providers === null || providers === void 0 ? void 0 : providers.forEach((provider) => {
        var _a;
        (_a = provider === null || provider === void 0 ? void 0 : provider.items) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const job = {
                jobProvider: (_a = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                company: {
                    id: provider === null || provider === void 0 ? void 0 : provider.id,
                    name: (_b = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                    image: (_d = (_c = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _c === void 0 ? void 0 : _c.images) === null || _d === void 0 ? void 0 : _d.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
                },
                jobId: item === null || item === void 0 ? void 0 : item.id,
                role: (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.name,
                description: (_f = item === null || item === void 0 ? void 0 : item.descriptor) === null || _f === void 0 ? void 0 : _f.long_desc,
                locations: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.locations) === null || _g === void 0 ? void 0 : _g.filter((location) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.location_ids) === null || _a === void 0 ? void 0 : _a.find((id) => id == (location === null || location === void 0 ? void 0 : location.id)); })) === null || _h === void 0 ? void 0 : _h.map((location) => {
                    var _a, _b, _c, _d, _e;
                    return ({
                        id: location === null || location === void 0 ? void 0 : location.id,
                        city: (_a = location === null || location === void 0 ? void 0 : location.city) === null || _a === void 0 ? void 0 : _a.name,
                        cityCode: (_b = location === null || location === void 0 ? void 0 : location.city) === null || _b === void 0 ? void 0 : _b.code,
                        state: (_c = location === null || location === void 0 ? void 0 : location.state) === null || _c === void 0 ? void 0 : _c.name,
                        country: (_d = location === null || location === void 0 ? void 0 : location.country) === null || _d === void 0 ? void 0 : _d.name,
                        countryCode: (_e = location === null || location === void 0 ? void 0 : location.country) === null || _e === void 0 ? void 0 : _e.code
                    });
                }),
                categories: (_k = (_j = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _j === void 0 ? void 0 : _j.filter((category) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.category_ids) === null || _a === void 0 ? void 0 : _a.find((id) => id == (category === null || category === void 0 ? void 0 : category.id)); })) === null || _k === void 0 ? void 0 : _k.map((category) => ({ id: category === null || category === void 0 ? void 0 : category.id, code: category === null || category === void 0 ? void 0 : category.descriptor.code })),
            };
            const compensation = [];
            payments === null || payments === void 0 ? void 0 : payments.filter((payment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.payment_ids) === null || _a === void 0 ? void 0 : _a.find((id) => (payment === null || payment === void 0 ? void 0 : payment.id) == id); }).forEach((payment) => {
                var _a, _b;
                (_b = (_a = payment === null || payment === void 0 ? void 0 : payment.tags) === null || _a === void 0 ? void 0 : _a.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "compensation_type"; })) === null || _b === void 0 ? void 0 : _b.list.forEach((li) => {
                    var _a, _b, _c, _d;
                    compensation === null || compensation === void 0 ? void 0 : compensation.push({
                        type: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                        amount: li === null || li === void 0 ? void 0 : li.value,
                        currency: (_b = payment === null || payment === void 0 ? void 0 : payment.params) === null || _b === void 0 ? void 0 : _b.currency,
                        frequency: (_d = (_c = payment === null || payment === void 0 ? void 0 : payment.time) === null || _c === void 0 ? void 0 : _c.schedule) === null || _d === void 0 ? void 0 : _d.frequency
                    });
                });
            });
            job.compensation = compensation;
            jobs.push(job);
        });
    });
    delete input.message;
    return Object.assign(Object.assign({}, input), { jobs });
};
exports.buildOnSearchResponse = buildOnSearchResponse;
const buildSelectRequest = (input = {}) => {
    var _a, _b, _c;
    const context = (0, exports.buildContext)({
        category: "jobs",
        action: 'on_search',
        bppId: (_a = input === null || input === void 0 ? void 0 : input.context) === null || _a === void 0 ? void 0 : _a.bppId,
        bppUri: (_b = input === null || input === void 0 ? void 0 : input.context) === null || _b === void 0 ? void 0 : _b.bppUri,
        transactionId: (_c = input === null || input === void 0 ? void 0 : input.context) === null || _c === void 0 ? void 0 : _c.transactionId,
    });
    const message = {
        order: {
            provider: { id: input === null || input === void 0 ? void 0 : input.companyId },
            items: [
                { id: input === null || input === void 0 ? void 0 : input.jobId }
            ]
        }
    };
    return { payload: { context, message } };
};
exports.buildSelectRequest = buildSelectRequest;
const buildSelectResponse = (input = {}) => {
    return input;
};
exports.buildSelectResponse = buildSelectResponse;
const buildOnSelectRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_select', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, bppId: input === null || input === void 0 ? void 0 : input.bppId, bppUri: input.bppUri });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnSelectRequest = buildOnSelectRequest;
const buildOnSelectResponse = (input = {}) => {
    var _a, _b, _c, _d, _e, _f;
    const provider = (_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.providers;
    const items = (_d = (_c = input === null || input === void 0 ? void 0 : input.message) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0 ? void 0 : _d.items;
    const xinput = (_f = (_e = input === null || input === void 0 ? void 0 : input.message) === null || _e === void 0 ? void 0 : _e.order) === null || _f === void 0 ? void 0 : _f.xinput;
    const jobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const job = {
            // jobProvider: provider?.descriptor?.name,
            company: {
                id: provider === null || provider === void 0 ? void 0 : provider.id,
                name: (_a = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                image: (_c = (_b = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _b === void 0 ? void 0 : _b.images) === null || _c === void 0 ? void 0 : _c.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
            },
            jobId: item === null || item === void 0 ? void 0 : item.id,
            role: (_d = item === null || item === void 0 ? void 0 : item.descriptor) === null || _d === void 0 ? void 0 : _d.name,
            description: (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.long_desc,
            locations: (_g = (_f = provider === null || provider === void 0 ? void 0 : provider.locations) === null || _f === void 0 ? void 0 : _f.filter((location) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.location_ids) === null || _a === void 0 ? void 0 : _a.find((id) => id == (location === null || location === void 0 ? void 0 : location.id)); })) === null || _g === void 0 ? void 0 : _g.map((location) => {
                var _a, _b, _c, _d, _e;
                return ({
                    id: location === null || location === void 0 ? void 0 : location.id,
                    city: (_a = location === null || location === void 0 ? void 0 : location.city) === null || _a === void 0 ? void 0 : _a.name,
                    cityCode: (_b = location === null || location === void 0 ? void 0 : location.city) === null || _b === void 0 ? void 0 : _b.code,
                    state: (_c = location === null || location === void 0 ? void 0 : location.state) === null || _c === void 0 ? void 0 : _c.name,
                    country: (_d = location === null || location === void 0 ? void 0 : location.country) === null || _d === void 0 ? void 0 : _d.name,
                    countryCode: (_e = location === null || location === void 0 ? void 0 : location.country) === null || _e === void 0 ? void 0 : _e.code
                });
            }),
            fulfillments: provider.fulfillments,
            categories: (_j = (_h = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _h === void 0 ? void 0 : _h.filter((category) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.category_ids) === null || _a === void 0 ? void 0 : _a.find((id) => id == (category === null || category === void 0 ? void 0 : category.id)); })) === null || _j === void 0 ? void 0 : _j.map((category) => ({ id: category === null || category === void 0 ? void 0 : category.id, code: category === null || category === void 0 ? void 0 : category.descriptor.code })),
        };
        const compensation = [];
        job.compensation = compensation;
        jobs.push(job);
    });
    delete input.message;
    return Object.assign(Object.assign({}, input), { jobs });
};
exports.buildOnSelectResponse = buildOnSelectResponse;
const buildInitRequest = (input = {}) => {
    var _a, _b, _c;
    const context = (0, exports.buildContext)({
        category: "jobs",
        action: 'init',
        bppId: (_a = input === null || input === void 0 ? void 0 : input.context) === null || _a === void 0 ? void 0 : _a.bppId,
        bppUri: (_b = input === null || input === void 0 ? void 0 : input.context) === null || _b === void 0 ? void 0 : _b.bppUri,
        transactionId: (_c = input === null || input === void 0 ? void 0 : input.context) === null || _c === void 0 ? void 0 : _c.transactionId,
    });
    const message = {
        order: {
            provider: { id: input === null || input === void 0 ? void 0 : input.companyId },
            items: [
                { id: input === null || input === void 0 ? void 0 : input.jobId }
            ],
            fulfillments: [{
                    id: input === null || input === void 0 ? void 0 : input.jobApplicantProfile.id,
                    customer: {
                        person: {
                            name: input.jobApplicantProfile.name,
                            languages: input.jobApplicantProfile.languages,
                            URL: input.jobApplicantProfile.url,
                            creds: input.jobApplicantProfile.creds.map((cred) => {
                                return cred;
                            }),
                            skills: input.jobApplicantProfile.skills.map((skill) => {
                                return skill;
                            }),
                        }
                    }
                }],
            xinput: input === null || input === void 0 ? void 0 : input.xinput
        },
    };
    return { payload: { context, message } };
};
exports.buildInitRequest = buildInitRequest;
const buildInitResponse = (input = {}) => {
    return input;
};
exports.buildInitResponse = buildInitResponse;
const buildOnInitRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_init', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, bppId: input === null || input === void 0 ? void 0 : input.bppId, bppUri: input.bppUri });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnInitRequest = buildOnInitRequest;
const buildOnInitResponse = (input = {}) => {
    return input;
};
exports.buildOnInitResponse = buildOnInitResponse;
const buildConfirmRequest = (input = {}) => {
    var _a, _b, _c;
    const context = (0, exports.buildContext)({
        category: "jobs",
        action: 'confirm',
        bppId: (_a = input === null || input === void 0 ? void 0 : input.context) === null || _a === void 0 ? void 0 : _a.bppId,
        bppUri: (_b = input === null || input === void 0 ? void 0 : input.context) === null || _b === void 0 ? void 0 : _b.bppUri,
        transactionId: (_c = input === null || input === void 0 ? void 0 : input.context) === null || _c === void 0 ? void 0 : _c.transactionId,
    });
    const message = {
        order: {
            provider: { id: input === null || input === void 0 ? void 0 : input.companyId },
            items: [
                { id: input === null || input === void 0 ? void 0 : input.jobId }
            ],
            fulfillments: [{
                    id: input === null || input === void 0 ? void 0 : input.jobApplicantProfile.id,
                    customer: {
                        person: {
                            name: input.jobApplicantProfile.name,
                            languages: input.jobApplicantProfile.languages,
                            URL: input.jobApplicantProfile.url,
                            creds: input.jobApplicantProfile.creds.map((cred) => {
                                return cred;
                            }),
                            skills: input.jobApplicantProfile.skills.map((skill) => {
                                return skill;
                            }),
                        }
                    }
                }],
            xinput: input === null || input === void 0 ? void 0 : input.xinput
        },
    };
    return { payload: { context, message } };
};
exports.buildConfirmRequest = buildConfirmRequest;
const buildConfirmResponse = (input = {}) => {
    return input;
};
exports.buildConfirmResponse = buildConfirmResponse;
const buildOnConfirmRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_confirm', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, bppId: input === null || input === void 0 ? void 0 : input.bppId, bppUri: input.bppUri });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnConfirmRequest = buildOnConfirmRequest;
const buildOnConfirmResponse = (input = {}) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_confirm', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, bppId: input === null || input === void 0 ? void 0 : input.bppId, bppUri: input.bppUri });
    const message = input === null || input === void 0 ? void 0 : input.message;
    return { payload: { context, message } };
};
exports.buildOnConfirmResponse = buildOnConfirmResponse;
const buildError = (input = {}) => {
    return {
        code: "404",
        message: input.message,
        data: input.data,
        type: "Application error",
        path: input.path
    };
};
exports.buildError = buildError;

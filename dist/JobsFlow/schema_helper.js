"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onConfirmMessageBuilder = exports.onInitJobMessageBuilder = exports.onSelectJobMessageBuilder = exports.onSearchResponseBuilder = exports.buildSelectRequest = exports.confirmMessageBuilder = exports.initJobMessageBuilder = exports.searchJobMessageBuilder = void 0;
const searchJobMessageBuilder = (body) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const intent = {};
    if ((_a = body === null || body === void 0 ? void 0 : body.titles) === null || _a === void 0 ? void 0 : _a[0].key) {
        intent.item = {
            "descriptor": {
                "name": (_b = body === null || body === void 0 ? void 0 : body.titles) === null || _b === void 0 ? void 0 : _b[0].key
            }
        };
    }
    if ((_c = body === null || body === void 0 ? void 0 : body.companies) === null || _c === void 0 ? void 0 : _c[0].name) {
        intent.provider = {
            "descriptor": {
                "name": (_d = body === null || body === void 0 ? void 0 : body.companies) === null || _d === void 0 ? void 0 : _d[0].name
            },
        };
    }
    if ((_e = body === null || body === void 0 ? void 0 : body.companies) === null || _e === void 0 ? void 0 : _e[0].locations) {
        intent.provider = { locations: (_f = body === null || body === void 0 ? void 0 : body.companies) === null || _f === void 0 ? void 0 : _f[0].locations };
    }
    if ((_g = body === null || body === void 0 ? void 0 : body.skills) === null || _g === void 0 ? void 0 : _g.length) {
        intent.tags = [{
                code: "Skills",
                name: "",
                list: (_h = body === null || body === void 0 ? void 0 : body.skills) === null || _h === void 0 ? void 0 : _h.map((skill) => { return { code: skill.skill }; })
            }];
    }
    const message = { message: { intent: intent } };
    return message;
};
exports.searchJobMessageBuilder = searchJobMessageBuilder;
const initJobMessageBuilder = (body) => {
    return {};
};
exports.initJobMessageBuilder = initJobMessageBuilder;
const confirmMessageBuilder = (input) => {
    var _a, _b, _c, _d;
    return {
        context: {
            domain: "dsep:jobs",
            version: "1.0.0",
            bap_id: "https://examplebap.io/",
            bap_uri: "http://affinidibpp.com/path/to/endpoint",
            bpp_id: (_a = input === null || input === void 0 ? void 0 : input.context) === null || _a === void 0 ? void 0 : _a.bppId,
            bpp_uri: (_b = input === null || input === void 0 ? void 0 : input.context) === null || _b === void 0 ? void 0 : _b.bppUri,
            transaction_id: (_c = input === null || input === void 0 ? void 0 : input.context) === null || _c === void 0 ? void 0 : _c.transactionId,
            message_id: (_d = input === null || input === void 0 ? void 0 : input.context) === null || _d === void 0 ? void 0 : _d.transactionId,
            timestamp: Date.now(),
        },
        message: {
            order: {
                provider: {
                    id: input === null || input === void 0 ? void 0 : input.companyId
                },
                items: [{
                        id: input === null || input === void 0 ? void 0 : input.jobId
                    }]
            }
        }
    };
};
exports.confirmMessageBuilder = confirmMessageBuilder;
const buildSelectRequest = (input) => {
    var _a, _b, _c, _d;
    return {
        context: {
            domain: "dsep:jobs",
            version: "1.0.0",
            bap_id: "https://examplebap.io/",
            bap_uri: "http://affinidibpp.com/path/to/endpoint",
            bpp_id: (_a = input === null || input === void 0 ? void 0 : input.context) === null || _a === void 0 ? void 0 : _a.bppId,
            bpp_uri: (_b = input === null || input === void 0 ? void 0 : input.context) === null || _b === void 0 ? void 0 : _b.bppUri,
            transaction_id: (_c = input === null || input === void 0 ? void 0 : input.context) === null || _c === void 0 ? void 0 : _c.transactionId,
            message_id: (_d = input === null || input === void 0 ? void 0 : input.context) === null || _d === void 0 ? void 0 : _d.transactionId,
            timestamp: Date.now(),
        },
        message: {
            order: {
                provider: {
                    id: input === null || input === void 0 ? void 0 : input.companyId
                },
                items: [{
                        id: input === null || input === void 0 ? void 0 : input.jobId
                    }]
            }
        }
    };
};
exports.buildSelectRequest = buildSelectRequest;
const onSearchResponseBuilder = (input = {}) => {
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
exports.onSearchResponseBuilder = onSearchResponseBuilder;
const onSelectJobMessageBuilder = (body) => {
    return {};
};
exports.onSelectJobMessageBuilder = onSelectJobMessageBuilder;
const onInitJobMessageBuilder = (body) => {
    return {};
};
exports.onInitJobMessageBuilder = onInitJobMessageBuilder;
const onConfirmMessageBuilder = (body) => {
    return {};
};
exports.onConfirmMessageBuilder = onConfirmMessageBuilder;

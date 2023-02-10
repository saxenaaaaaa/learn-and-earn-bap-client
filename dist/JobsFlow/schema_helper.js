"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildError = exports.buildOnConfirmResponse = exports.buildOnConfirmRequest = exports.buildConfirmResponse = exports.buildConfirmRequest = exports.buildOnInitResponse = exports.buildOnInitRequest = exports.buildInitResponse = exports.buildInitRequest = exports.buildOnSelectResponse = exports.buildOnSelectRequest = exports.buildSelectResponse = exports.buildSelectRequest = exports.buildOnSearchResponse = exports.buildOnSearchRequest = exports.buildSearchResponse = exports.buildSearchRequest = exports.isAcknowledged = exports.buildContext = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return {
        domain: process.env.DOMAIN + (input === null || input === void 0 ? void 0 : input.category),
        action: (_a = input === null || input === void 0 ? void 0 : input.action) !== null && _a !== void 0 ? _a : "",
        location: { city: { code: process.env.CITY || ((_b = input === null || input === void 0 ? void 0 : input.city) !== null && _b !== void 0 ? _b : "") }, country: { code: process.env.COUNTRY || ((_c = input === null || input === void 0 ? void 0 : input.country) !== null && _c !== void 0 ? _c : "") } },
        core_version: process.env.CORE_VERSION || ((_d = input === null || input === void 0 ? void 0 : input.core_version) !== null && _d !== void 0 ? _d : ""),
        bap_id: process.env.BAP_ID || ((_e = input === null || input === void 0 ? void 0 : input.bapId) !== null && _e !== void 0 ? _e : ""),
        bap_uri: process.env.BAP_URI || ((_f = input === null || input === void 0 ? void 0 : input.bapUri) !== null && _f !== void 0 ? _f : ""),
        bpp_id: ((_g = input === null || input === void 0 ? void 0 : input.bppId) !== null && _g !== void 0 ? _g : ""),
        bpp_uri: ((_h = input === null || input === void 0 ? void 0 : input.bppUri) !== null && _h !== void 0 ? _h : ""),
        transaction_id: (_j = input === null || input === void 0 ? void 0 : input.transactionId) !== null && _j !== void 0 ? _j : (0, uuid_1.v4)(),
        message_id: (_k = input === null || input === void 0 ? void 0 : input.messageId) !== null && _k !== void 0 ? _k : (0, uuid_1.v4)(),
        timestamp: (_l = input.timestamp) !== null && _l !== void 0 ? _l : (0, moment_1.default)().toISOString(),
    };
};
exports.buildContext = buildContext;
const isAcknowledged = (input = {}) => {
    var _a, _b;
    return (((_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.ack) === null || _b === void 0 ? void 0 : _b.status) === "ACK");
};
exports.isAcknowledged = isAcknowledged;
const buildSearchRequest = (input = {}) => {
    var _a, _b, _c, _d, _e, _f;
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'search' });
    const intent = {};
    if ((_a = input === null || input === void 0 ? void 0 : input.title) === null || _a === void 0 ? void 0 : _a.key) {
        intent.item = { "descriptor": { "name": (_b = input === null || input === void 0 ? void 0 : input.title) === null || _b === void 0 ? void 0 : _b.key } };
    }
    if (input === null || input === void 0 ? void 0 : input.company.name) {
        intent.provider = { "descriptor": { "name": (_c = input === null || input === void 0 ? void 0 : input.company) === null || _c === void 0 ? void 0 : _c.name } };
    }
    if (input === null || input === void 0 ? void 0 : input.company.locations) {
        intent.provider = {
            locations: (_e = (_d = input === null || input === void 0 ? void 0 : input.company) === null || _d === void 0 ? void 0 : _d.locations) === null || _e === void 0 ? void 0 : _e.map((city) => {
                return city;
            })
        };
    }
    if ((_f = input === null || input === void 0 ? void 0 : input.skills) === null || _f === void 0 ? void 0 : _f.length) {
        intent.fulfillment = { customer: { person: { skills: input === null || input === void 0 ? void 0 : input.skills } } };
    }
    const message = { intent: intent };
    console.log(message.intent.item);
    return { payload: { context, message } };
};
exports.buildSearchRequest = buildSearchRequest;
const buildSearchResponse = (input = {}, body = {}) => {
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = input;
    const context = { transactionId, messageId, bppId, bppUri };
    return { data: { context } };
};
exports.buildSearchResponse = buildSearchResponse;
const buildOnSearchRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_search', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnSearchRequest = buildOnSearchRequest;
const buildOnSearchResponse = (input = {}, body = {}) => {
    var _a, _b, _c, _d;
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = input.context;
    const context = { transactionId, messageId, bppId, bppUri };
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
    return { data: { context, jobs } };
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
const buildSelectResponse = (input = {}, body = {}) => {
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = input;
    const context = { transactionId, messageId, bppId, bppUri };
    return { data: { context, message: input === null || input === void 0 ? void 0 : input.message } };
};
exports.buildSelectResponse = buildSelectResponse;
const buildOnSelectRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ transactionId: input.transaction_id, messageId: input.message_id, bppId: input.bpp_id, bppUri: input.bpp_uri });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnSelectRequest = buildOnSelectRequest;
const buildOnSelectResponse = (input = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = input === null || input === void 0 ? void 0 : input.context;
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.provider;
    const items = (_d = (_c = input === null || input === void 0 ? void 0 : input.message) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0 ? void 0 : _d.items;
    const xinput = (_f = (_e = input === null || input === void 0 ? void 0 : input.message) === null || _e === void 0 ? void 0 : _e.order) === null || _f === void 0 ? void 0 : _f.xinput;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_g = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _g === void 0 ? void 0 : _g.name,
        image: (_j = (_h = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _h === void 0 ? void 0 : _h.images) === null || _j === void 0 ? void 0 : _j.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const selectedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
        const job = {
            jobId: item === null || item === void 0 ? void 0 : item.id,
            role: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
            description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
            locations: (_d = (_c = provider === null || provider === void 0 ? void 0 : provider.locations) === null || _c === void 0 ? void 0 : _c.filter((location) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.location_ids) === null || _a === void 0 ? void 0 : _a.find((locationId) => location.id == locationId); })) === null || _d === void 0 ? void 0 : _d.map((location) => {
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
            fulfillmentCategory: (_f = (_e = item === null || item === void 0 ? void 0 : item.fulfillments) === null || _e === void 0 ? void 0 : _e.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id) == fulfillmentId); })) === null || _f === void 0 ? void 0 : _f.map((fulfillment) => fulfillment),
            educationalQualifications: (_h = (_g = item === null || item === void 0 ? void 0 : item.tags) === null || _g === void 0 ? void 0 : _g.filter((tag) => { var _a, _b, _c; return (_c = (_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === null || _c === void 0 ? void 0 : _c.includes('qualifications'); })) === null || _h === void 0 ? void 0 : _h.map((tag) => {
                var _a, _b, _c;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_c = (_b = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const workExperience = (_j = item === null || item === void 0 ? void 0 : item.tags) === null || _j === void 0 ? void 0 : _j.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const employmentInformation = (_k = item === null || item === void 0 ? void 0 : item.tags) === null || _k === void 0 ? void 0 : _k.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_l = item === null || item === void 0 ? void 0 : item.tags) === null || _l === void 0 ? void 0 : _l.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.workExperience = {
            key: (_m = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _m === void 0 ? void 0 : _m.name,
            experience: (_p = (_o = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _o === void 0 ? void 0 : _o.list) === null || _p === void 0 ? void 0 : _p.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.employmentInformation = {
            code: (_q = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _q === void 0 ? void 0 : _q.code,
            name: (_r = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _r === void 0 ? void 0 : _r.name,
            employmentInfo: {
                code: (_v = (_u = (_t = (_s = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _s === void 0 ? void 0 : _s.list) === null || _t === void 0 ? void 0 : _t[0]) === null || _u === void 0 ? void 0 : _u.descriptor) === null || _v === void 0 ? void 0 : _v.code,
                name: (_z = (_y = (_x = (_w = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _w === void 0 ? void 0 : _w.list) === null || _x === void 0 ? void 0 : _x[0]) === null || _y === void 0 ? void 0 : _y.descriptor) === null || _z === void 0 ? void 0 : _z.name,
                value: (_2 = (_1 = (_0 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _0 === void 0 ? void 0 : _0.list) === null || _1 === void 0 ? void 0 : _1[0]) === null || _2 === void 0 ? void 0 : _2.value
            }
        };
        job.compensation = {
            code: (_3 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _3 === void 0 ? void 0 : _3.code,
            name: (_4 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _4 === void 0 ? void 0 : _4.name,
            salaryInfo: (_6 = (_5 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _5 === void 0 ? void 0 : _5.list) === null || _6 === void 0 ? void 0 : _6.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        job.additionalFormUrl = (_7 = xinput === null || xinput === void 0 ? void 0 : xinput.form) === null || _7 === void 0 ? void 0 : _7.url;
        selectedJobs.push(job);
    });
    return { data: { context, company, selectedJobs } };
};
exports.buildOnSelectResponse = buildOnSelectResponse;
const buildInitRequest = (input) => {
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
                { id: input === null || input === void 0 ? void 0 : input.jobs.jobId }
            ],
            fulfillments: input.jobFulfillments.map((data) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return {
                    id: data === null || data === void 0 ? void 0 : data.JobFulfillmentCategoryId,
                    customer: {
                        person: {
                            name: (_a = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _a === void 0 ? void 0 : _a.name,
                            languages: (_c = (_b = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _b === void 0 ? void 0 : _b.languages) === null || _c === void 0 ? void 0 : _c.map((language) => {
                                return language;
                            }),
                            URL: (_d = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _d === void 0 ? void 0 : _d.profileUrl,
                            creds: {
                                url: (_f = (_e = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _e === void 0 ? void 0 : _e.creds) === null || _f === void 0 ? void 0 : _f.url,
                                type: (_h = (_g = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _g === void 0 ? void 0 : _g.creds) === null || _h === void 0 ? void 0 : _h.type
                            },
                            skills: (_k = (_j = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _j === void 0 ? void 0 : _j.skills) === null || _k === void 0 ? void 0 : _k.map((skill) => {
                                return skill;
                            }),
                        }
                    }
                };
            }),
            xinput: input === null || input === void 0 ? void 0 : input.xinput
        },
    };
    return { payload: { context, message } };
};
exports.buildInitRequest = buildInitRequest;
const buildInitResponse = (input = {}, body = {}) => {
    return { data: { input } };
};
exports.buildInitResponse = buildInitResponse;
const buildOnInitRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_init', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, bppId: input === null || input === void 0 ? void 0 : input.bppId, bppUri: input.bppUri });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnInitRequest = buildOnInitRequest;
const buildOnInitResponse = (input = {}, body = {}) => {
    return { data: { input } };
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
const buildConfirmResponse = (input = {}, body = {}) => {
    return { data: input };
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
    return { data: { context, message } };
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

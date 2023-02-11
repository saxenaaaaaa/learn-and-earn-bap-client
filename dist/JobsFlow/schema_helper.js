"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOnStatusResponse = exports.buildOnStatusRequest = exports.buildStatusResponse = exports.buildStatusRequest = exports.buildError = exports.buildOnConfirmResponse = exports.buildOnConfirmRequest = exports.buildConfirmResponse = exports.buildConfirmRequest = exports.buildOnInitResponse = exports.buildOnInitRequest = exports.buildInitResponse = exports.buildInitRequest = exports.buildOnSelectResponse = exports.buildOnSelectRequest = exports.buildSelectResponse = exports.buildSelectRequest = exports.buildOnSearchResponse = exports.buildOnSearchRequest = exports.buildSearchResponse = exports.buildSearchRequest = exports.isAcknowledged = exports.buildContext = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return {
        domain: process.env.DOMAIN + (input === null || input === void 0 ? void 0 : input.category),
        action: (_a = input === null || input === void 0 ? void 0 : input.action) !== null && _a !== void 0 ? _a : "",
        location: { city: { code: process.env.CITY || ((_b = input === null || input === void 0 ? void 0 : input.city) !== null && _b !== void 0 ? _b : "") }, country: { code: process.env.COUNTRY || ((_c = input === null || input === void 0 ? void 0 : input.country) !== null && _c !== void 0 ? _c : "") } },
        version: process.env.CORE_VERSION || ((_d = input === null || input === void 0 ? void 0 : input.core_version) !== null && _d !== void 0 ? _d : ""),
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'search' });
    const intent = {};
    if ((_a = input === null || input === void 0 ? void 0 : input.title) === null || _a === void 0 ? void 0 : _a.key) {
        intent.item = { "descriptor": { "name": (_b = input === null || input === void 0 ? void 0 : input.title) === null || _b === void 0 ? void 0 : _b.key } };
    }
    if ((_c = input === null || input === void 0 ? void 0 : input.company) === null || _c === void 0 ? void 0 : _c.name) {
        intent.provider = { "descriptor": { "name": (_d = input === null || input === void 0 ? void 0 : input.company) === null || _d === void 0 ? void 0 : _d.name } };
    }
    if (input === null || input === void 0 ? void 0 : input.company.locations) {
        intent.provider = Object.assign(Object.assign({}, ((_e = intent === null || intent === void 0 ? void 0 : intent.provider) !== null && _e !== void 0 ? _e : {})), { locations: (_g = (_f = input === null || input === void 0 ? void 0 : input.company) === null || _f === void 0 ? void 0 : _f.locations) === null || _g === void 0 ? void 0 : _g.map((city) => {
                return city;
            }) });
    }
    if ((_h = input === null || input === void 0 ? void 0 : input.skills) === null || _h === void 0 ? void 0 : _h.length) {
        intent.fulfillment = { customer: { person: { skills: input === null || input === void 0 ? void 0 : input.skills } } };
    }
    const message = { intent: intent };
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
    var _a, _b, _c, _d, _e;
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = input.context;
    const context = { transactionId, messageId };
    const providers = (_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.catalog) === null || _b === void 0 ? void 0 : _b.providers;
    const jobProviderPlatform = (_e = (_d = (_c = input === null || input === void 0 ? void 0 : input.message) === null || _c === void 0 ? void 0 : _c.catalog) === null || _d === void 0 ? void 0 : _d.descriptor) === null || _e === void 0 ? void 0 : _e.name;
    const jobResults = providers === null || providers === void 0 ? void 0 : providers.map((provider) => {
        var _a, _b, _c, _d;
        return ({
            company: {
                id: provider === null || provider === void 0 ? void 0 : provider.id,
                name: (_a = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                imageLink: (_c = (_b = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _b === void 0 ? void 0 : _b.images) === null || _c === void 0 ? void 0 : _c.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
            },
            jobs: (_d = provider === null || provider === void 0 ? void 0 : provider.items) === null || _d === void 0 ? void 0 : _d.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return ({
                    jobId: item === null || item === void 0 ? void 0 : item.id,
                    role: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
                    additionalDesc: { url: (_d = (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.additional_desc) === null || _d === void 0 ? void 0 : _d.url, contentType: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.additional_desc) === null || _f === void 0 ? void 0 : _f.content_type },
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
                });
            }),
        });
    });
    return { data: { context, jobProviderPlatform, jobResults } };
};
exports.buildOnSearchResponse = buildOnSearchResponse;
const buildSelectRequest = (input = {}) => {
    var _a, _b, _c;
    const context = (0, exports.buildContext)({
        category: "jobs",
        action: 'select',
        bppId: (_a = input === null || input === void 0 ? void 0 : input.context) === null || _a === void 0 ? void 0 : _a.bppId,
        bppUri: (_b = input === null || input === void 0 ? void 0 : input.context) === null || _b === void 0 ? void 0 : _b.bppUri,
        transactionId: (_c = input === null || input === void 0 ? void 0 : input.context) === null || _c === void 0 ? void 0 : _c.transactionId,
    });
    const message = {
        order: {
            provider: { id: input === null || input === void 0 ? void 0 : input.companyId },
            items: [
                { id: input === null || input === void 0 ? void 0 : input.jobs.jobId }
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
    const context = { transactionId, bppId, bppUri };
    const provider = (_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.provider;
    const items = (_d = (_c = input === null || input === void 0 ? void 0 : input.message) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0 ? void 0 : _d.items;
    const xinput = (_f = (_e = input === null || input === void 0 ? void 0 : input.message) === null || _e === void 0 ? void 0 : _e.order) === null || _f === void 0 ? void 0 : _f.xinput;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_g = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _g === void 0 ? void 0 : _g.name,
        imageLink: (_j = (_h = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _h === void 0 ? void 0 : _h.images) === null || _j === void 0 ? void 0 : _j.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const selectedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        const job = {
            jobId: item === null || item === void 0 ? void 0 : item.id,
            role: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
            description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
            additionalDesc: { url: (_d = (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.additional_desc) === null || _d === void 0 ? void 0 : _d.url, contentType: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.additional_desc) === null || _f === void 0 ? void 0 : _f.content_type },
            locations: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.locations) === null || _g === void 0 ? void 0 : _g.filter((location) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.location_ids) === null || _a === void 0 ? void 0 : _a.find((locationId) => location.id == locationId); })) === null || _h === void 0 ? void 0 : _h.map((location) => {
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
            fulfillmentCategory: (_k = (_j = provider.fulfillments) === null || _j === void 0 ? void 0 : _j.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id) == fulfillmentId); })) === null || _k === void 0 ? void 0 : _k.map((fulfillment) => fulfillment),
            educationalQualifications: (_m = (_l = item === null || item === void 0 ? void 0 : item.tags) === null || _l === void 0 ? void 0 : _l.filter((tag) => { var _a, _b, _c; return (_c = (_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === null || _c === void 0 ? void 0 : _c.includes('qualifications'); })) === null || _m === void 0 ? void 0 : _m.map((tag) => {
                var _a, _b, _c;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_c = (_b = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const workExperience = (_o = item === null || item === void 0 ? void 0 : item.tags) === null || _o === void 0 ? void 0 : _o.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const responsibilities = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "responsibilities"; });
        const employmentInformation = (_q = item === null || item === void 0 ? void 0 : item.tags) === null || _q === void 0 ? void 0 : _q.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.workExperience = {
            key: (_s = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _s === void 0 ? void 0 : _s.name,
            experience: (_u = (_t = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _t === void 0 ? void 0 : _t.list) === null || _u === void 0 ? void 0 : _u.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.responsibilities = (_w = (_v = responsibilities === null || responsibilities === void 0 ? void 0 : responsibilities.descriptor) === null || _v === void 0 ? void 0 : _v.list) === null || _w === void 0 ? void 0 : _w.map((li) => li.value);
        job.employmentInformation = {
            code: (_x = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _x === void 0 ? void 0 : _x.code,
            name: (_y = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _y === void 0 ? void 0 : _y.name,
            employmentInfo: (_0 = (_z = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _z === void 0 ? void 0 : _z.list) === null || _0 === void 0 ? void 0 : _0.map((li) => {
                var _a, _b;
                return ({
                    code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                    name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                    value: li === null || li === void 0 ? void 0 : li.value
                });
            })
        };
        job.compensation = {
            code: (_1 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _1 === void 0 ? void 0 : _1.code,
            name: (_2 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _2 === void 0 ? void 0 : _2.name,
            salaryInfo: (_4 = (_3 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _3 === void 0 ? void 0 : _3.list) === null || _4 === void 0 ? void 0 : _4.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        job.additionalFormUrl = (_5 = xinput === null || xinput === void 0 ? void 0 : xinput.form) === null || _5 === void 0 ? void 0 : _5.url;
        selectedJobs.push(job);
    });
    return { data: { context, company, selectedJobs } };
};
exports.buildOnSelectResponse = buildOnSelectResponse;
const buildInitRequest = (input) => {
    var _a, _b, _c, _d;
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
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return {
                    id: data === null || data === void 0 ? void 0 : data.JobFulfillmentCategoryId,
                    customer: {
                        person: {
                            name: (_a = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _a === void 0 ? void 0 : _a.name,
                            languages: (_c = (_b = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _b === void 0 ? void 0 : _b.languages) === null || _c === void 0 ? void 0 : _c.map((language) => {
                                return { code: language };
                            }),
                            URL: (_d = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _d === void 0 ? void 0 : _d.profileUrl,
                            creds: (_f = (_e = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _e === void 0 ? void 0 : _e.creds) === null || _f === void 0 ? void 0 : _f.map((data) => {
                                return { url: data.url, type: data.type };
                            }),
                            skills: (_h = (_g = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _g === void 0 ? void 0 : _g.skills) === null || _h === void 0 ? void 0 : _h.map((skill) => {
                                return { name: skill };
                            }),
                        }
                    }
                };
            }),
            xinput: { data: Object.fromEntries((_d = input === null || input === void 0 ? void 0 : input.additionalFormData) === null || _d === void 0 ? void 0 : _d.map((formData) => [formData === null || formData === void 0 ? void 0 : formData.formInputKey, formData === null || formData === void 0 ? void 0 : formData.formInputValue])) }
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
const buildOnInitResponse = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = input === null || input === void 0 ? void 0 : input.context;
    const context = { transactionId, bppId, bppUri };
    const provider = (_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.provider;
    const items = (_d = (_c = input === null || input === void 0 ? void 0 : input.message) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0 ? void 0 : _d.items;
    const xinput = (_f = (_e = input === null || input === void 0 ? void 0 : input.message) === null || _e === void 0 ? void 0 : _e.order) === null || _f === void 0 ? void 0 : _f.xinput;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_g = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _g === void 0 ? void 0 : _g.name,
        imageLink: (_j = (_h = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _h === void 0 ? void 0 : _h.images) === null || _j === void 0 ? void 0 : _j.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const initiatedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        const job = {
            jobId: item === null || item === void 0 ? void 0 : item.id,
            role: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
            description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
            additionalDesc: { url: (_d = (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.additional_desc) === null || _d === void 0 ? void 0 : _d.url, contentType: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.additional_desc) === null || _f === void 0 ? void 0 : _f.content_type },
            locations: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.locations) === null || _g === void 0 ? void 0 : _g.filter((location) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.location_ids) === null || _a === void 0 ? void 0 : _a.find((locationId) => location.id == locationId); })) === null || _h === void 0 ? void 0 : _h.map((location) => {
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
            fulfillmentCategory: (_k = (_j = item === null || item === void 0 ? void 0 : item.fulfillments) === null || _j === void 0 ? void 0 : _j.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id) == fulfillmentId); })) === null || _k === void 0 ? void 0 : _k.map((fulfillment) => fulfillment),
            educationalQualifications: (_m = (_l = item === null || item === void 0 ? void 0 : item.tags) === null || _l === void 0 ? void 0 : _l.filter((tag) => { var _a, _b, _c; return (_c = (_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === null || _c === void 0 ? void 0 : _c.includes('qualifications'); })) === null || _m === void 0 ? void 0 : _m.map((tag) => {
                var _a, _b, _c;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_c = (_b = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const responsibilities = (_o = item === null || item === void 0 ? void 0 : item.tags) === null || _o === void 0 ? void 0 : _o.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "responsibilities"; });
        const workExperience = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const employmentInformation = (_q = item === null || item === void 0 ? void 0 : item.tags) === null || _q === void 0 ? void 0 : _q.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.responsibilities = (_t = (_s = responsibilities === null || responsibilities === void 0 ? void 0 : responsibilities.descriptor) === null || _s === void 0 ? void 0 : _s.list) === null || _t === void 0 ? void 0 : _t.map((li) => li.value);
        job.workExperience = {
            key: (_u = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _u === void 0 ? void 0 : _u.name,
            experience: (_w = (_v = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _v === void 0 ? void 0 : _v.list) === null || _w === void 0 ? void 0 : _w.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.employmentInformation = {
            code: (_x = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _x === void 0 ? void 0 : _x.code,
            name: (_y = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _y === void 0 ? void 0 : _y.name,
            employmentInfo: (_0 = (_z = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _z === void 0 ? void 0 : _z.list) === null || _0 === void 0 ? void 0 : _0.map((li) => {
                var _a, _b;
                return ({
                    code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                    name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                    value: li === null || li === void 0 ? void 0 : li.value
                });
            })
        };
        job.compensation = {
            code: (_1 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _1 === void 0 ? void 0 : _1.code,
            name: (_2 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _2 === void 0 ? void 0 : _2.name,
            salaryInfo: (_4 = (_3 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _3 === void 0 ? void 0 : _3.list) === null || _4 === void 0 ? void 0 : _4.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        initiatedJobs.push(job);
    });
    const jobFulfillments = (_l = (_k = input === null || input === void 0 ? void 0 : input.message) === null || _k === void 0 ? void 0 : _k.order) === null || _l === void 0 ? void 0 : _l.fulfillments.map((fulfilment) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return ({
            jobFulfillmentCategoryId: fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.id,
            jobApplicantProfile: {
                name: (_b = (_a = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _a === void 0 ? void 0 : _a.person) === null || _b === void 0 ? void 0 : _b.name,
                language: (_e = (_d = (_c = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _c === void 0 ? void 0 : _c.person) === null || _d === void 0 ? void 0 : _d.languages) === null || _e === void 0 ? void 0 : _e.map((language) => language === null || language === void 0 ? void 0 : language.code),
                profileUrl: (_g = (_f = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _f === void 0 ? void 0 : _f.person) === null || _g === void 0 ? void 0 : _g.url,
                creds: (_j = (_h = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _h === void 0 ? void 0 : _h.person) === null || _j === void 0 ? void 0 : _j.creds,
                skills: (_m = (_l = (_k = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _k === void 0 ? void 0 : _k.person) === null || _l === void 0 ? void 0 : _l.skills) === null || _m === void 0 ? void 0 : _m.map((skill) => skill === null || skill === void 0 ? void 0 : skill.name)
            }
        });
    });
    const additionalFormUrl = (_m = xinput === null || xinput === void 0 ? void 0 : xinput.form) === null || _m === void 0 ? void 0 : _m.url;
    const additionalFormData = (_p = Object.entries((_o = xinput === null || xinput === void 0 ? void 0 : xinput.data) !== null && _o !== void 0 ? _o : {})) === null || _p === void 0 ? void 0 : _p.map(([key, value]) => ({ formInputKey: key, formInputValue: value }));
    return { data: { context, company, initiatedJobs, jobFulfillments, additionalFormUrl, additionalFormData } };
};
exports.buildOnInitResponse = buildOnInitResponse;
const buildConfirmRequest = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
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
                    id: (_d = input === null || input === void 0 ? void 0 : input.confirmation) === null || _d === void 0 ? void 0 : _d.JobFulfillmentCategoryId,
                    customer: {
                        person: {
                            name: (_f = (_e = input === null || input === void 0 ? void 0 : input.confirmation) === null || _e === void 0 ? void 0 : _e.jobApplicantProfile) === null || _f === void 0 ? void 0 : _f.name,
                            languages: (_h = (_g = input === null || input === void 0 ? void 0 : input.confirmation) === null || _g === void 0 ? void 0 : _g.jobApplicantProfile) === null || _h === void 0 ? void 0 : _h.languages,
                            URL: (_k = (_j = input === null || input === void 0 ? void 0 : input.confirmation) === null || _j === void 0 ? void 0 : _j.jobApplicantProfile) === null || _k === void 0 ? void 0 : _k.url,
                            creds: (_m = (_l = input === null || input === void 0 ? void 0 : input.confirmation) === null || _l === void 0 ? void 0 : _l.jobApplicantProfile) === null || _m === void 0 ? void 0 : _m.creds.map((cred) => {
                                return cred;
                            }),
                            skills: (_q = (_p = (_o = input === null || input === void 0 ? void 0 : input.confirmation) === null || _o === void 0 ? void 0 : _o.jobApplicantProfile) === null || _p === void 0 ? void 0 : _p.skills) === null || _q === void 0 ? void 0 : _q.map((skill) => {
                                return skill;
                            }),
                        }
                    }
                }],
            xinput: input === null || input === void 0 ? void 0 : input.xinput
        },
    };
    if (!(input === null || input === void 0 ? void 0 : input.companyId)) {
        (_r = message === null || message === void 0 ? void 0 : message.order) === null || _r === void 0 ? true : delete _r.provider;
    }
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = input === null || input === void 0 ? void 0 : input.context;
    const context = { transactionId, bppId, bppUri };
    const provider = (_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.provider;
    const items = (_d = (_c = input === null || input === void 0 ? void 0 : input.message) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0 ? void 0 : _d.items;
    const xinput = (_f = (_e = input === null || input === void 0 ? void 0 : input.message) === null || _e === void 0 ? void 0 : _e.order) === null || _f === void 0 ? void 0 : _f.xinput;
    const applicationId = (_h = (_g = input === null || input === void 0 ? void 0 : input.message) === null || _g === void 0 ? void 0 : _g.order) === null || _h === void 0 ? void 0 : _h.id;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_j = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _j === void 0 ? void 0 : _j.name,
        imageLink: (_l = (_k = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _k === void 0 ? void 0 : _k.images) === null || _l === void 0 ? void 0 : _l.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const confirmedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
        const job = {
            jobId: item === null || item === void 0 ? void 0 : item.id,
            role: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
            description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
            additionalDesc: { url: (_d = (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.additional_desc) === null || _d === void 0 ? void 0 : _d.url, contentType: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.additional_desc) === null || _f === void 0 ? void 0 : _f.content_type },
            locations: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.locations) === null || _g === void 0 ? void 0 : _g.filter((location) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.location_ids) === null || _a === void 0 ? void 0 : _a.find((locationId) => location.id == locationId); })) === null || _h === void 0 ? void 0 : _h.map((location) => {
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
            fulfillmentCategory: (_k = (_j = item === null || item === void 0 ? void 0 : item.fulfillments) === null || _j === void 0 ? void 0 : _j.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id) == fulfillmentId); })) === null || _k === void 0 ? void 0 : _k.map((fulfillment) => fulfillment),
            educationalQualifications: (_m = (_l = item === null || item === void 0 ? void 0 : item.tags) === null || _l === void 0 ? void 0 : _l.filter((tag) => { var _a, _b, _c; return (_c = (_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === null || _c === void 0 ? void 0 : _c.includes('qualifications'); })) === null || _m === void 0 ? void 0 : _m.map((tag) => {
                var _a, _b, _c;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_c = (_b = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const responsibilities = (_o = item === null || item === void 0 ? void 0 : item.tags) === null || _o === void 0 ? void 0 : _o.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "responsibilities"; });
        const workExperience = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const employmentInformation = (_q = item === null || item === void 0 ? void 0 : item.tags) === null || _q === void 0 ? void 0 : _q.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.responsibilities = (_t = (_s = responsibilities === null || responsibilities === void 0 ? void 0 : responsibilities.descriptor) === null || _s === void 0 ? void 0 : _s.list) === null || _t === void 0 ? void 0 : _t.map((li) => li.value);
        job.workExperience = {
            key: (_u = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _u === void 0 ? void 0 : _u.name,
            experience: (_w = (_v = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _v === void 0 ? void 0 : _v.list) === null || _w === void 0 ? void 0 : _w.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.employmentInformation = {
            code: (_x = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _x === void 0 ? void 0 : _x.code,
            name: (_y = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _y === void 0 ? void 0 : _y.name,
            employmentInfo: {
                code: (_2 = (_1 = (_0 = (_z = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _z === void 0 ? void 0 : _z.list) === null || _0 === void 0 ? void 0 : _0[0]) === null || _1 === void 0 ? void 0 : _1.descriptor) === null || _2 === void 0 ? void 0 : _2.code,
                name: (_6 = (_5 = (_4 = (_3 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _3 === void 0 ? void 0 : _3.list) === null || _4 === void 0 ? void 0 : _4[0]) === null || _5 === void 0 ? void 0 : _5.descriptor) === null || _6 === void 0 ? void 0 : _6.name,
                value: (_9 = (_8 = (_7 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _7 === void 0 ? void 0 : _7.list) === null || _8 === void 0 ? void 0 : _8[0]) === null || _9 === void 0 ? void 0 : _9.value
            }
        };
        job.compensation = {
            code: (_10 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _10 === void 0 ? void 0 : _10.code,
            name: (_11 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _11 === void 0 ? void 0 : _11.name,
            salaryInfo: (_13 = (_12 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _12 === void 0 ? void 0 : _12.list) === null || _13 === void 0 ? void 0 : _13.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        confirmedJobs.push(job);
    });
    const jobFulfillments = (_o = (_m = input === null || input === void 0 ? void 0 : input.message) === null || _m === void 0 ? void 0 : _m.order) === null || _o === void 0 ? void 0 : _o.fulfillments.map((fulfilment) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return ({
            jobFulfillmentCategoryId: fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.id,
            jobApplicantProfile: {
                name: (_b = (_a = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _a === void 0 ? void 0 : _a.person) === null || _b === void 0 ? void 0 : _b.name,
                language: (_e = (_d = (_c = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _c === void 0 ? void 0 : _c.person) === null || _d === void 0 ? void 0 : _d.languages) === null || _e === void 0 ? void 0 : _e.map((language) => language === null || language === void 0 ? void 0 : language.code),
                profileUrl: (_g = (_f = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _f === void 0 ? void 0 : _f.person) === null || _g === void 0 ? void 0 : _g.url,
                creds: (_j = (_h = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _h === void 0 ? void 0 : _h.person) === null || _j === void 0 ? void 0 : _j.creds,
                skills: (_m = (_l = (_k = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _k === void 0 ? void 0 : _k.person) === null || _l === void 0 ? void 0 : _l.skills) === null || _m === void 0 ? void 0 : _m.map((skill) => skill === null || skill === void 0 ? void 0 : skill.name)
            },
            state: (_o = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.state) === null || _o === void 0 ? void 0 : _o.descriptor
        });
    });
    const additionalFormData = (_q = Object.entries((_p = xinput === null || xinput === void 0 ? void 0 : xinput.data) !== null && _p !== void 0 ? _p : {})) === null || _q === void 0 ? void 0 : _q.map(([key, value]) => ({ formInputKey: key, formInputValue: value }));
    return { data: { context, applicationId, company, confirmedJobs, jobFulfillments, additionalFormData } };
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
const buildStatusRequest = (input = {}) => {
    var _a, _b, _c;
    const context = (0, exports.buildContext)({
        category: "jobs",
        action: 'status',
        bppId: (_a = input === null || input === void 0 ? void 0 : input.context) === null || _a === void 0 ? void 0 : _a.bppId,
        bppUri: (_b = input === null || input === void 0 ? void 0 : input.context) === null || _b === void 0 ? void 0 : _b.bppUri,
        transactionId: (_c = input === null || input === void 0 ? void 0 : input.context) === null || _c === void 0 ? void 0 : _c.transactionId,
    });
    const message = {
        order: {
            id: input === null || input === void 0 ? void 0 : input.applicationId
        },
    };
    return { payload: { context, message } };
};
exports.buildStatusRequest = buildStatusRequest;
const buildStatusResponse = (input = {}) => {
    return { data: input };
};
exports.buildStatusResponse = buildStatusResponse;
const buildOnStatusRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_status', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, bppId: input === null || input === void 0 ? void 0 : input.bppId, bppUri: input.bppUri });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnStatusRequest = buildOnStatusRequest;
const buildOnStatusResponse = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = input === null || input === void 0 ? void 0 : input.context;
    const context = { transactionId, bppId, bppUri };
    const provider = (_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.provider;
    const items = (_d = (_c = input === null || input === void 0 ? void 0 : input.message) === null || _c === void 0 ? void 0 : _c.order) === null || _d === void 0 ? void 0 : _d.items;
    const xinput = (_f = (_e = input === null || input === void 0 ? void 0 : input.message) === null || _e === void 0 ? void 0 : _e.order) === null || _f === void 0 ? void 0 : _f.xinput;
    const applicationId = (_h = (_g = input === null || input === void 0 ? void 0 : input.message) === null || _g === void 0 ? void 0 : _g.order) === null || _h === void 0 ? void 0 : _h.id;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_j = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _j === void 0 ? void 0 : _j.name,
        imageLink: (_l = (_k = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _k === void 0 ? void 0 : _k.images) === null || _l === void 0 ? void 0 : _l.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const confirmedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
        const job = {
            jobId: item === null || item === void 0 ? void 0 : item.id,
            role: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
            description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
            additionalDesc: { url: (_d = (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.additional_desc) === null || _d === void 0 ? void 0 : _d.url, contentType: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.additional_desc) === null || _f === void 0 ? void 0 : _f.content_type },
            locations: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.locations) === null || _g === void 0 ? void 0 : _g.filter((location) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.location_ids) === null || _a === void 0 ? void 0 : _a.find((locationId) => location.id == locationId); })) === null || _h === void 0 ? void 0 : _h.map((location) => {
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
            fulfillmentCategory: (_k = (_j = item === null || item === void 0 ? void 0 : item.fulfillments) === null || _j === void 0 ? void 0 : _j.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id) == fulfillmentId); })) === null || _k === void 0 ? void 0 : _k.map((fulfillment) => fulfillment),
            educationalQualifications: (_m = (_l = item === null || item === void 0 ? void 0 : item.tags) === null || _l === void 0 ? void 0 : _l.filter((tag) => { var _a, _b, _c; return (_c = (_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === null || _c === void 0 ? void 0 : _c.includes('qualifications'); })) === null || _m === void 0 ? void 0 : _m.map((tag) => {
                var _a, _b, _c;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_c = (_b = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const responsibilities = (_o = item === null || item === void 0 ? void 0 : item.tags) === null || _o === void 0 ? void 0 : _o.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "responsibilities"; });
        const workExperience = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const employmentInformation = (_q = item === null || item === void 0 ? void 0 : item.tags) === null || _q === void 0 ? void 0 : _q.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.responsibilities = (_t = (_s = responsibilities === null || responsibilities === void 0 ? void 0 : responsibilities.descriptor) === null || _s === void 0 ? void 0 : _s.list) === null || _t === void 0 ? void 0 : _t.map((li) => li.value);
        job.workExperience = {
            key: (_u = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _u === void 0 ? void 0 : _u.name,
            experience: (_w = (_v = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _v === void 0 ? void 0 : _v.list) === null || _w === void 0 ? void 0 : _w.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.employmentInformation = {
            code: (_x = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _x === void 0 ? void 0 : _x.code,
            name: (_y = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _y === void 0 ? void 0 : _y.name,
            employmentInfo: {
                code: (_2 = (_1 = (_0 = (_z = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _z === void 0 ? void 0 : _z.list) === null || _0 === void 0 ? void 0 : _0[0]) === null || _1 === void 0 ? void 0 : _1.descriptor) === null || _2 === void 0 ? void 0 : _2.code,
                name: (_6 = (_5 = (_4 = (_3 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _3 === void 0 ? void 0 : _3.list) === null || _4 === void 0 ? void 0 : _4[0]) === null || _5 === void 0 ? void 0 : _5.descriptor) === null || _6 === void 0 ? void 0 : _6.name,
                value: (_9 = (_8 = (_7 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _7 === void 0 ? void 0 : _7.list) === null || _8 === void 0 ? void 0 : _8[0]) === null || _9 === void 0 ? void 0 : _9.value
            }
        };
        job.compensation = {
            code: (_10 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _10 === void 0 ? void 0 : _10.code,
            name: (_11 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _11 === void 0 ? void 0 : _11.name,
            salaryInfo: (_13 = (_12 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _12 === void 0 ? void 0 : _12.list) === null || _13 === void 0 ? void 0 : _13.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        confirmedJobs.push(job);
    });
    const jobFulfillments = (_o = (_m = input === null || input === void 0 ? void 0 : input.message) === null || _m === void 0 ? void 0 : _m.order) === null || _o === void 0 ? void 0 : _o.fulfillments.map((fulfilment) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return ({
            jobFulfillmentCategoryId: fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.id,
            jobApplicantProfile: {
                name: (_b = (_a = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _a === void 0 ? void 0 : _a.person) === null || _b === void 0 ? void 0 : _b.name,
                language: (_e = (_d = (_c = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _c === void 0 ? void 0 : _c.person) === null || _d === void 0 ? void 0 : _d.languages) === null || _e === void 0 ? void 0 : _e.map((language) => language === null || language === void 0 ? void 0 : language.code),
                profileUrl: (_g = (_f = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _f === void 0 ? void 0 : _f.person) === null || _g === void 0 ? void 0 : _g.url,
                creds: (_j = (_h = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _h === void 0 ? void 0 : _h.person) === null || _j === void 0 ? void 0 : _j.creds,
                skills: (_m = (_l = (_k = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.customer) === null || _k === void 0 ? void 0 : _k.person) === null || _l === void 0 ? void 0 : _l.skills) === null || _m === void 0 ? void 0 : _m.map((skill) => skill === null || skill === void 0 ? void 0 : skill.name)
            },
            jobStatus: { status: (_p = (_o = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.state) === null || _o === void 0 ? void 0 : _o.descriptor) === null || _p === void 0 ? void 0 : _p.name, statusCode: (_r = (_q = fulfilment === null || fulfilment === void 0 ? void 0 : fulfilment.state) === null || _q === void 0 ? void 0 : _q.descriptor) === null || _r === void 0 ? void 0 : _r.name }
        });
    });
    const additionalFormUrl = (_p = xinput === null || xinput === void 0 ? void 0 : xinput.form) === null || _p === void 0 ? void 0 : _p.url;
    const additionalFormData = (_r = Object.entries((_q = xinput === null || xinput === void 0 ? void 0 : xinput.data) !== null && _q !== void 0 ? _q : {})) === null || _r === void 0 ? void 0 : _r.map(([key, value]) => ({ formInputKey: key, formInputValue: value }));
    return { data: { context, applicationId, company, confirmedJobs, jobFulfillments, additionalFormUrl, additionalFormData } };
};
exports.buildOnStatusResponse = buildOnStatusResponse;

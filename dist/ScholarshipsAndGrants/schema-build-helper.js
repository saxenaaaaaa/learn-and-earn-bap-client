"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStatusResponse = exports.buildStatusRequest = exports.buildConfirmResponse = exports.buildConfirmRequest = exports.buildInitResponse = exports.buildInitRequest = exports.buildSelectResponse = exports.buildSelectRequest = exports.buildSavedAppliedCategoryResponse = exports.buildSearchResponse = exports.buildOnSearchMergedResponse = exports.buildSearchRequest = exports.buildContext = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    console.log("input", input);
    const context = {
        domain: `${process.env.DOMAIN}${(_a = input === null || input === void 0 ? void 0 : input.category) !== null && _a !== void 0 ? _a : "scholarships"}`,
        location: {
            city: {
                name: process.env.CITY || "",
                code: process.env.CITY_CODE || ""
            },
            country: {
                name: process.env.COUNTRY || "",
                code: process.env.COUNTRY_CODE || ""
            }
        },
        action: (_b = input.action) !== null && _b !== void 0 ? _b : "",
        version: `${process.env.CORE_VERSION || ((_c = input === null || input === void 0 ? void 0 : input.core_version) !== null && _c !== void 0 ? _c : "")}`,
        transaction_id: (_d = input === null || input === void 0 ? void 0 : input.transactionId) !== null && _d !== void 0 ? _d : (0, uuid_1.v4)(),
        bap_id: process.env.BAP_ID || ((_e = input === null || input === void 0 ? void 0 : input.bapId) !== null && _e !== void 0 ? _e : ""),
        bap_uri: process.env.BAP_URI || ((_f = input === null || input === void 0 ? void 0 : input.bapUri) !== null && _f !== void 0 ? _f : ""),
        bpp_id: input === null || input === void 0 ? void 0 : input.bppId,
        bpp_uri: input === null || input === void 0 ? void 0 : input.bppUri,
        message_id: (_g = input === null || input === void 0 ? void 0 : input.messageId) !== null && _g !== void 0 ? _g : (0, uuid_1.v4)(),
        timestamp: (_h = input.timestamp) !== null && _h !== void 0 ? _h : (0, moment_1.default)().toISOString()
    };
    return context;
};
exports.buildContext = buildContext;
const buildSearchRequest = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const context = (0, exports.buildContext)({ action: "search", category: "scholarships" });
    const message = {
        intent: { item: {}, provider: {} }
    };
    const optional = {};
    const fulfillment = {
        customer: {
            person: {}
        }
    };
    const tags = [];
    if (input === null || input === void 0 ? void 0 : input.name) {
        message.intent.item = Object.assign(Object.assign({}, message.intent.item), { descriptor: {
                name: input === null || input === void 0 ? void 0 : input.name
            } });
    }
    if (input === null || input === void 0 ? void 0 : input.gender) {
        fulfillment.customer.person = Object.assign(Object.assign({}, fulfillment.customer.person), { gender: input === null || input === void 0 ? void 0 : input.gender });
    }
    if (input === null || input === void 0 ? void 0 : input.finStatus) {
        fulfillment.customer.person = Object.assign(Object.assign({}, fulfillment.customer.person), { tags: [
                ...tags,
                {
                    code: "fin_status",
                    list: [
                        {
                            code: "family_income",
                            value: (_a = input === null || input === void 0 ? void 0 : input.finStatus) === null || _a === void 0 ? void 0 : _a.family_income
                        }
                    ]
                }
            ] });
    }
    if ((_b = input === null || input === void 0 ? void 0 : input.casteCategory) === null || _b === void 0 ? void 0 : _b.length) {
        (_c = input === null || input === void 0 ? void 0 : input.casteCategory) === null || _c === void 0 ? void 0 : _c.forEach((caste) => {
            fulfillment.customer.person.tags.push({
                code: "caste_category",
                list: [
                    {
                        value: caste === null || caste === void 0 ? void 0 : caste.caste
                    }
                ]
            });
        });
    }
    if (input === null || input === void 0 ? void 0 : input.loggedInUserEmail) {
        optional.user = { "email": input === null || input === void 0 ? void 0 : input.loggedInUserEmail };
    }
    message.intent.provider = {
        categories: (_d = input === null || input === void 0 ? void 0 : input.categories) === null || _d === void 0 ? void 0 : _d.map((category) => ({
            descriptor: { code: category === null || category === void 0 ? void 0 : category.code }
        }))
    };
    if ((_g = Object.keys((_f = (_e = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.customer) === null || _e === void 0 ? void 0 : _e.person) !== null && _f !== void 0 ? _f : {})) === null || _g === void 0 ? void 0 : _g.length) {
        message.intent.fulfillment = fulfillment;
    }
    return { payload: { context, message }, optional };
};
exports.buildSearchRequest = buildSearchRequest;
const buildOnSearchMergedResponse = (response = {}, body = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    let savedAppliedResult = (response === null || response === void 0 ? void 0 : response.itemRes) ? yield (0, exports.buildSavedAppliedCategoryResponse)(response.itemRes[0], response.itemRes[1]) : null;
    return (0, exports.buildSearchResponse)(response.searchRes, body, (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.itemRes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.scholarship, (_f = (_e = (_d = response === null || response === void 0 ? void 0 : response.itemRes) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.scholarship);
});
exports.buildOnSearchMergedResponse = buildOnSearchMergedResponse;
const buildSearchResponse = (res = {}, body = {}, savedItems = [], appliedItems = []) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const response = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!response)
        return { status: 200 };
    const context = {
        transactionId: (_c = response === null || response === void 0 ? void 0 : response.context) === null || _c === void 0 ? void 0 : _c.transaction_id,
        bppId: (_d = response === null || response === void 0 ? void 0 : response.context) === null || _d === void 0 ? void 0 : _d.bpp_id,
        bppUri: (_e = response === null || response === void 0 ? void 0 : response.context) === null || _e === void 0 ? void 0 : _e.bpp_uri
    };
    const scholarshipProviders = (_h = (_g = (_f = response === null || response === void 0 ? void 0 : response.message) === null || _f === void 0 ? void 0 : _f.catalog) === null || _g === void 0 ? void 0 : _g.providers) === null || _h === void 0 ? void 0 : _h.map((provider) => {
        var _a, _b;
        return ({
            id: provider === null || provider === void 0 ? void 0 : provider.id,
            name: (_a = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _a === void 0 ? void 0 : _a.name,
            scholarships: (_b = provider === null || provider === void 0 ? void 0 : provider.items) === null || _b === void 0 ? void 0 : _b.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return ({
                    id: item === null || item === void 0 ? void 0 : item.id,
                    name: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
                    userSavedItem: !!(savedItems === null || savedItems === void 0 ? void 0 : savedItems.find((savedItem) => (savedItem === null || savedItem === void 0 ? void 0 : savedItem.scholarship_id) == (item === null || item === void 0 ? void 0 : item.id))),
                    userAppliedItem: !!(appliedItems === null || appliedItems === void 0 ? void 0 : appliedItems.find((appliedItem) => (appliedItem === null || appliedItem === void 0 ? void 0 : appliedItem.scholarship_id) == (item === null || item === void 0 ? void 0 : item.id))),
                    amount: {
                        amount: (_c = item === null || item === void 0 ? void 0 : item.price) === null || _c === void 0 ? void 0 : _c.value,
                        currency: (_d = item === null || item === void 0 ? void 0 : item.price) === null || _d === void 0 ? void 0 : _d.currency
                    },
                    categories: (_f = (_e = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _e === void 0 ? void 0 : _e.filter((category) => {
                        var _a;
                        return (_a = item.category_ids) === null || _a === void 0 ? void 0 : _a.find((category_id) => category_id == (category === null || category === void 0 ? void 0 : category.id));
                    })) === null || _f === void 0 ? void 0 : _f.map((category) => {
                        var _a, _b;
                        return ({
                            id: category === null || category === void 0 ? void 0 : category.id,
                            code: (_a = category === null || category === void 0 ? void 0 : category.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                            name: (_b = category === null || category === void 0 ? void 0 : category.descriptor) === null || _b === void 0 ? void 0 : _b.name
                        });
                    }),
                    scholarshipDetails: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.fulfillments) === null || _g === void 0 ? void 0 : _g.filter((fulfillment) => {
                        var _a;
                        return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillment_id) => fulfillment_id == (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id));
                    })) === null || _h === void 0 ? void 0 : _h.map((fulfillment) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                        return ({
                            id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                            type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                            gender: (_b = (_a = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.customer) === null || _a === void 0 ? void 0 : _a.person) === null || _b === void 0 ? void 0 : _b.gender,
                            applicationStartDate: (_e = (_d = (_c = fulfillment.stops) === null || _c === void 0 ? void 0 : _c.find((stop) => (stop === null || stop === void 0 ? void 0 : stop.type) == "APPLICATION-START")) === null || _d === void 0 ? void 0 : _d.time) === null || _e === void 0 ? void 0 : _e.timestamp,
                            applicationEndDate: (_h = (_g = (_f = fulfillment.stops) === null || _f === void 0 ? void 0 : _f.find((stop) => (stop === null || stop === void 0 ? void 0 : stop.type) == "APPLICATION-END")) === null || _g === void 0 ? void 0 : _g.time) === null || _h === void 0 ? void 0 : _h.timestamp,
                            supportContact: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact,
                            academicQualifications: (_o = (_m = (_l = (_k = (_j = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.customer) === null || _j === void 0 ? void 0 : _j.person) === null || _k === void 0 ? void 0 : _k.tags) === null || _l === void 0 ? void 0 : _l.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "academic_qualifications"; })) === null || _m === void 0 ? void 0 : _m.list) === null || _o === void 0 ? void 0 : _o.map((li) => {
                                var _a, _b;
                                return ({
                                    code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                                    name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                                    value: li === null || li === void 0 ? void 0 : li.value
                                });
                            })
                        });
                    })
                });
            })
        });
    });
    return { data: { context, scholarshipProviders } };
};
exports.buildSearchResponse = buildSearchResponse;
const buildSavedAppliedCategoryResponse = (savedResponse = {}, appliedResponse = {}) => {
    var _a, _b;
    const savedInput = (_a = savedResponse === null || savedResponse === void 0 ? void 0 : savedResponse.data) === null || _a === void 0 ? void 0 : _a.scholarship;
    const appliedInput = (_b = appliedResponse === null || appliedResponse === void 0 ? void 0 : appliedResponse.data) === null || _b === void 0 ? void 0 : _b.scholarship;
    const scholarshipMap = {
        saved: {}, applied: {}
    };
    if (savedResponse === null || savedResponse === void 0 ? void 0 : savedResponse.data) {
        savedInput.forEach(({ scholarship_id }) => {
            scholarshipMap['saved'][scholarship_id] = true;
        });
    }
    if (appliedResponse === null || appliedResponse === void 0 ? void 0 : appliedResponse.data) {
        appliedInput.forEach(({ scholarship_id }) => {
            scholarshipMap['applied'][scholarship_id] = true;
        });
    }
    return scholarshipMap;
};
exports.buildSavedAppliedCategoryResponse = buildSavedAppliedCategoryResponse;
const buildSelectRequest = (input = {}) => {
    var _a;
    const payload = {
        context: (0, exports.buildContext)(Object.assign(Object.assign({}, ((_a = input === null || input === void 0 ? void 0 : input.context) !== null && _a !== void 0 ? _a : {})), { action: "select" })),
        message: {
            order: {
                provider: { id: input === null || input === void 0 ? void 0 : input.scholarshipProviderId },
                items: [{ id: input === null || input === void 0 ? void 0 : input.scholarshipId }]
            }
        }
    };
    return { payload };
};
exports.buildSelectRequest = buildSelectRequest;
const buildSelectResponse = (res = {}, input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const response = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!response)
        return { status: 200 };
    const context = {
        transactionId: (_c = response === null || response === void 0 ? void 0 : response.context) === null || _c === void 0 ? void 0 : _c.transaction_id,
        bppId: (_d = response === null || response === void 0 ? void 0 : response.context) === null || _d === void 0 ? void 0 : _d.bpp_id,
        bppUri: (_e = response === null || response === void 0 ? void 0 : response.context) === null || _e === void 0 ? void 0 : _e.bpp_uri
    };
    const provider = (_g = (_f = response === null || response === void 0 ? void 0 : response.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.provider;
    const scholarshipProviders = [
        {
            id: provider === null || provider === void 0 ? void 0 : provider.id,
            name: (_h = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _h === void 0 ? void 0 : _h.name,
            description: (_k = (_j = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _j === void 0 ? void 0 : _j.long_desc) !== null && _k !== void 0 ? _k : (_l = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _l === void 0 ? void 0 : _l.short_desc,
            scholarships: (_p = (_o = (_m = response === null || response === void 0 ? void 0 : response.message) === null || _m === void 0 ? void 0 : _m.order) === null || _o === void 0 ? void 0 : _o.items) === null || _p === void 0 ? void 0 : _p.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
                return ({
                    id: item === null || item === void 0 ? void 0 : item.id,
                    name: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
                    amount: {
                        amount: (_c = item === null || item === void 0 ? void 0 : item.price) === null || _c === void 0 ? void 0 : _c.value,
                        currency: (_d = item === null || item === void 0 ? void 0 : item.price) === null || _d === void 0 ? void 0 : _d.currency
                    },
                    additionalFormData: {
                        formUrl: (_f = (_e = item === null || item === void 0 ? void 0 : item.xinput) === null || _e === void 0 ? void 0 : _e.form) === null || _f === void 0 ? void 0 : _f.url,
                        formMimeType: (_h = (_g = item === null || item === void 0 ? void 0 : item.xinput) === null || _g === void 0 ? void 0 : _g.form) === null || _h === void 0 ? void 0 : _h.mime_type,
                        submissionId: (_k = (_j = item === null || item === void 0 ? void 0 : item.xinput) === null || _j === void 0 ? void 0 : _j.form) === null || _k === void 0 ? void 0 : _k.submission_id,
                        data: Object.keys((_o = (_m = (_l = item === null || item === void 0 ? void 0 : item.xinput) === null || _l === void 0 ? void 0 : _l.form) === null || _m === void 0 ? void 0 : _m.data) !== null && _o !== void 0 ? _o : {}).map((key) => { var _a, _b; return { formInputKey: key, formInputValue: (_b = (_a = item === null || item === void 0 ? void 0 : item.xinput) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.data[key] }; })
                    },
                    academicQualifications: (_r = (_q = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "edu_qual"; })) === null || _q === void 0 ? void 0 : _q.list) === null || _r === void 0 ? void 0 : _r.map((li) => {
                        var _a, _b;
                        return ({
                            code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                            name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                            value: li === null || li === void 0 ? void 0 : li.value
                        });
                    }),
                    academicQualificationsCriteria: (_u = (_t = (_s = item === null || item === void 0 ? void 0 : item.tags) === null || _s === void 0 ? void 0 : _s.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "edu_qual"; })) === null || _t === void 0 ? void 0 : _t.list) === null || _u === void 0 ? void 0 : _u.map((li) => {
                        var _a, _b;
                        return ({
                            code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                            name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                            value: li === null || li === void 0 ? void 0 : li.value
                        });
                    }),
                    finStatusCriteria: (_x = (_w = (_v = item === null || item === void 0 ? void 0 : item.tags) === null || _v === void 0 ? void 0 : _v.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "fin_status"; })) === null || _w === void 0 ? void 0 : _w.list) === null || _x === void 0 ? void 0 : _x.map((li) => {
                        var _a, _b;
                        return ({
                            code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                            name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                            value: li === null || li === void 0 ? void 0 : li.value
                        });
                    }),
                    benefits: (_0 = (_z = (_y = item === null || item === void 0 ? void 0 : item.tags) === null || _y === void 0 ? void 0 : _y.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "benefits"; })) === null || _z === void 0 ? void 0 : _z.list) === null || _0 === void 0 ? void 0 : _0.map((li) => {
                        var _a, _b;
                        return ({
                            code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                            name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                            value: li === null || li === void 0 ? void 0 : li.value
                        });
                    }),
                    categories: (_4 = (_3 = (_2 = (_1 = response === null || response === void 0 ? void 0 : response.message) === null || _1 === void 0 ? void 0 : _1.order) === null || _2 === void 0 ? void 0 : _2.categories) === null || _3 === void 0 ? void 0 : _3.filter((category) => {
                        var _a;
                        return (_a = item.category_ids) === null || _a === void 0 ? void 0 : _a.find((category_id) => category_id == (category === null || category === void 0 ? void 0 : category.id));
                    })) === null || _4 === void 0 ? void 0 : _4.map((category) => {
                        var _a, _b;
                        return ({
                            id: category === null || category === void 0 ? void 0 : category.id,
                            code: (_a = category === null || category === void 0 ? void 0 : category.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                            name: (_b = category === null || category === void 0 ? void 0 : category.descriptor) === null || _b === void 0 ? void 0 : _b.name
                        });
                    }),
                    scholarshipDetails: (_7 = (_6 = (_5 = response === null || response === void 0 ? void 0 : response.message) === null || _5 === void 0 ? void 0 : _5.order) === null || _6 === void 0 ? void 0 : _6.fulfillments) === null || _7 === void 0 ? void 0 : _7.map((fulfillment) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                        return ({
                            id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                            type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                            gender: (_b = (_a = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.customer) === null || _a === void 0 ? void 0 : _a.person) === null || _b === void 0 ? void 0 : _b.gender,
                            applicationStartDate: (_e = (_d = (_c = fulfillment.stops) === null || _c === void 0 ? void 0 : _c.find((stop) => (stop === null || stop === void 0 ? void 0 : stop.type) == "APPLICATION-START")) === null || _d === void 0 ? void 0 : _d.time) === null || _e === void 0 ? void 0 : _e.timestamp,
                            applicationEndDate: (_h = (_g = (_f = fulfillment.stops) === null || _f === void 0 ? void 0 : _f.find((stop) => (stop === null || stop === void 0 ? void 0 : stop.type) == "APPLICATION-END")) === null || _g === void 0 ? void 0 : _g.time) === null || _h === void 0 ? void 0 : _h.timestamp,
                            supportContact: Object.assign({ name: (_k = (_j = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.customer) === null || _j === void 0 ? void 0 : _j.person) === null || _k === void 0 ? void 0 : _k.name }, ((_l = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) !== null && _l !== void 0 ? _l : {})),
                            academicQualifications: (_r = (_q = (_p = (_o = (_m = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.customer) === null || _m === void 0 ? void 0 : _m.person) === null || _o === void 0 ? void 0 : _o.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "edu_qual"; })) === null || _q === void 0 ? void 0 : _q.list) === null || _r === void 0 ? void 0 : _r.map((li) => {
                                var _a, _b;
                                return ({
                                    code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                                    name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                                    value: li === null || li === void 0 ? void 0 : li.value
                                });
                            })
                        });
                    })
                });
            })
        }
    ];
    return { data: { context, scholarshipProviders } };
};
exports.buildSelectResponse = buildSelectResponse;
const buildInitRequest = (input = {}) => {
    var _a, _b;
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { category: "scholarships", action: "init" }));
    const { scholarshipProvider = {} } = input;
    const message = {
        order: {
            type: "DEFAULT",
            provider: {
                id: scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.id,
                descriptor: {
                    name: scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.name,
                    short_desc: scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.name
                },
                rateable: false
            },
            items: (_a = scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.scholarships) === null || _a === void 0 ? void 0 : _a.map((scholarship) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                const tags = [];
                if ((scholarship === null || scholarship === void 0 ? void 0 : scholarship.academicQualificationsCriteria) &&
                    (scholarship === null || scholarship === void 0 ? void 0 : scholarship.academicQualificationsCriteria.length)) {
                    tags.push({
                        display: true,
                        descriptor: {
                            code: "edu_qual",
                            name: "Academic Eligibility"
                        },
                        list: (_a = scholarship === null || scholarship === void 0 ? void 0 : scholarship.academicQualificationsCriteria) === null || _a === void 0 ? void 0 : _a.map((quali) => {
                            return {
                                descriptor: {
                                    code: quali === null || quali === void 0 ? void 0 : quali.code,
                                    name: quali === null || quali === void 0 ? void 0 : quali.name
                                },
                                value: (quali === null || quali === void 0 ? void 0 : quali.code) === "passing_year"
                                    ? `${quali === null || quali === void 0 ? void 0 : quali.value}`
                                    : quali === null || quali === void 0 ? void 0 : quali.value,
                                display: true
                            };
                        })
                    });
                }
                if ((scholarship === null || scholarship === void 0 ? void 0 : scholarship.finStatusCriteria) &&
                    (scholarship === null || scholarship === void 0 ? void 0 : scholarship.finStatusCriteria.length)) {
                    tags.push({
                        display: true,
                        descriptor: {
                            code: "fin_status",
                            name: "Financial Status"
                        },
                        list: (_b = scholarship === null || scholarship === void 0 ? void 0 : scholarship.finStatusCriteria) === null || _b === void 0 ? void 0 : _b.map((stats) => {
                            return {
                                descriptor: {
                                    code: stats === null || stats === void 0 ? void 0 : stats.code,
                                    name: stats === null || stats === void 0 ? void 0 : stats.name
                                },
                                value: stats === null || stats === void 0 ? void 0 : stats.value,
                                display: true
                            };
                        })
                    });
                }
                if ((scholarship === null || scholarship === void 0 ? void 0 : scholarship.benefits) && (scholarship === null || scholarship === void 0 ? void 0 : scholarship.benefits.length)) {
                    tags.push({
                        display: true,
                        descriptor: {
                            code: "benefits",
                            name: "Benefits"
                        },
                        list: (_c = scholarship === null || scholarship === void 0 ? void 0 : scholarship.benefits) === null || _c === void 0 ? void 0 : _c.map((benef) => {
                            return {
                                descriptor: {
                                    code: benef === null || benef === void 0 ? void 0 : benef.code,
                                    name: benef === null || benef === void 0 ? void 0 : benef.name
                                },
                                value: benef === null || benef === void 0 ? void 0 : benef.value,
                                display: true
                            };
                        })
                    });
                }
                return {
                    id: scholarship === null || scholarship === void 0 ? void 0 : scholarship.id,
                    descriptor: {
                        name: scholarship === null || scholarship === void 0 ? void 0 : scholarship.name,
                        short_desc: scholarship === null || scholarship === void 0 ? void 0 : scholarship.name
                    },
                    price: {
                        currency: (_d = scholarship === null || scholarship === void 0 ? void 0 : scholarship.amount) === null || _d === void 0 ? void 0 : _d.currency,
                        value: (_f = (_e = scholarship === null || scholarship === void 0 ? void 0 : scholarship.amount) === null || _e === void 0 ? void 0 : _e.amount) === null || _f === void 0 ? void 0 : _f.toString()
                    },
                    xinput: {
                        required: true,
                        form: {
                            url: (_g = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _g === void 0 ? void 0 : _g.formUrl,
                            mime_type: (_h = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _h === void 0 ? void 0 : _h.formMimeType,
                            data: {
                                name: (_k = (_j = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _j === void 0 ? void 0 : _j.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "name")) === null || _k === void 0 ? void 0 : _k.formInputValue,
                                phone: `${(_m = (_l = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _l === void 0 ? void 0 : _l.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "phone")) === null || _m === void 0 ? void 0 : _m.formInputValue}`,
                                address: (_p = (_o = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _o === void 0 ? void 0 : _o.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "address")) === null || _p === void 0 ? void 0 : _p.formInputValue,
                                needOfScholarship: (_r = (_q = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _q === void 0 ? void 0 : _q.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "needOfScholarship")) === null || _r === void 0 ? void 0 : _r.formInputValue,
                                docUrl: (_t = (_s = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _s === void 0 ? void 0 : _s.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "docUrl")) === null || _t === void 0 ? void 0 : _t.formInputValue
                            },
                            submission_id: (_u = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _u === void 0 ? void 0 : _u.submissionId
                        }
                    },
                    tags: tags,
                    rateable: false,
                    category_ids: [scholarship === null || scholarship === void 0 ? void 0 : scholarship.categoryId]
                };
            }),
            fulfillments: (_b = scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.scholarships) === null || _b === void 0 ? void 0 : _b.map((scholarship) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return {
                    id: (_a = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _a === void 0 ? void 0 : _a.id,
                    type: (_b = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _b === void 0 ? void 0 : _b.type,
                    tracking: false,
                    customer: {
                        person: {
                            gender: "Male",
                            name: (_d = (_c = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _c === void 0 ? void 0 : _c.scholarshipRequestor) === null || _d === void 0 ? void 0 : _d.name
                        }
                    },
                    contact: {
                        phone: (_f = (_e = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _e === void 0 ? void 0 : _e.supportContact) === null || _f === void 0 ? void 0 : _f.phone,
                        email: (_h = (_g = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _g === void 0 ? void 0 : _g.supportContact) === null || _h === void 0 ? void 0 : _h.email
                    },
                    stops: [
                        {
                            type: "APPLICATION-START",
                            time: {
                                timestamp: (_j = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _j === void 0 ? void 0 : _j.applicationStartDate
                            }
                        },
                        {
                            type: "APPLICATION-END",
                            time: {
                                timestamp: (_k = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _k === void 0 ? void 0 : _k.applicationEndDate
                            }
                        }
                    ]
                };
            })
        }
    };
    return { payload: { context, message } };
};
exports.buildInitRequest = buildInitRequest;
const buildInitResponse = (response = {}, input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!response.responses.length) {
        return {
            context: {},
            scholarshipApplicationId: "",
            scholarshipProvider: {}
        };
    }
    const actualResponse = response === null || response === void 0 ? void 0 : response.responses[0];
    const context = {
        transactionId: (_a = actualResponse === null || actualResponse === void 0 ? void 0 : actualResponse.context) === null || _a === void 0 ? void 0 : _a.transaction_id,
        bppId: (_b = actualResponse === null || actualResponse === void 0 ? void 0 : actualResponse.context) === null || _b === void 0 ? void 0 : _b.bpp_id,
        bppUri: (_c = actualResponse === null || actualResponse === void 0 ? void 0 : actualResponse.context) === null || _c === void 0 ? void 0 : _c.bpp_uri
    };
    const { order = {} } = actualResponse === null || actualResponse === void 0 ? void 0 : actualResponse.message;
    const fulfillment = order === null || order === void 0 ? void 0 : order.fulfillments[0];
    // const scholarshipApplicationId = order?.id;
    const scholarshipProvider = {
        id: (_d = order === null || order === void 0 ? void 0 : order.provider) === null || _d === void 0 ? void 0 : _d.id,
        name: (_f = (_e = order === null || order === void 0 ? void 0 : order.provider) === null || _e === void 0 ? void 0 : _e.descriptor) === null || _f === void 0 ? void 0 : _f.name,
        description: (_h = (_g = order === null || order === void 0 ? void 0 : order.provider) === null || _g === void 0 ? void 0 : _g.descriptor) === null || _h === void 0 ? void 0 : _h.short_desc,
        scholarships: order === null || order === void 0 ? void 0 : order.items.map((scholarship) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
            return {
                id: scholarship === null || scholarship === void 0 ? void 0 : scholarship.id,
                name: (_a = scholarship === null || scholarship === void 0 ? void 0 : scholarship.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                description: (_b = scholarship === null || scholarship === void 0 ? void 0 : scholarship.descriptor) === null || _b === void 0 ? void 0 : _b.short_desc,
                categoryId: ((_c = scholarship === null || scholarship === void 0 ? void 0 : scholarship.category_ids) === null || _c === void 0 ? void 0 : _c.length)
                    ? scholarship === null || scholarship === void 0 ? void 0 : scholarship.category_ids[0]
                    : "",
                amount: {
                    amount: parseInt((_d = scholarship === null || scholarship === void 0 ? void 0 : scholarship.price) === null || _d === void 0 ? void 0 : _d.value),
                    currency: (_e = scholarship === null || scholarship === void 0 ? void 0 : scholarship.price) === null || _e === void 0 ? void 0 : _e.currency
                },
                scholarshipDetails: {
                    id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                    type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                    applicationStartDate: (_h = (_g = (_f = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.stops) === null || _f === void 0 ? void 0 : _f.find((stp) => (stp === null || stp === void 0 ? void 0 : stp.type) === "APPLICATION-START")) === null || _g === void 0 ? void 0 : _g.time) === null || _h === void 0 ? void 0 : _h.timestamp,
                    applicationEndDate: (_l = (_k = (_j = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.stops) === null || _j === void 0 ? void 0 : _j.find((stp) => (stp === null || stp === void 0 ? void 0 : stp.type) === "APPLICATION-END")) === null || _k === void 0 ? void 0 : _k.time) === null || _l === void 0 ? void 0 : _l.timestamp,
                    supportContact: {
                        name: (_m = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _m === void 0 ? void 0 : _m.email,
                        phone: (_o = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _o === void 0 ? void 0 : _o.phone,
                        email: (_p = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _p === void 0 ? void 0 : _p.email
                    },
                    scholarshipRequestor: (_r = (_q = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _q === void 0 ? void 0 : _q.form) === null || _r === void 0 ? void 0 : _r.data
                },
                additionalFormData: {
                    formUrl: (_t = (_s = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _s === void 0 ? void 0 : _s.form) === null || _t === void 0 ? void 0 : _t.url,
                    formMimeType: (_v = (_u = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _u === void 0 ? void 0 : _u.form) === null || _v === void 0 ? void 0 : _v.mime_type,
                    submissionId: (_x = (_w = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _w === void 0 ? void 0 : _w.form) === null || _x === void 0 ? void 0 : _x.submission_id,
                    data: Object.keys((_z = (_y = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _y === void 0 ? void 0 : _y.form) === null || _z === void 0 ? void 0 : _z.data).map((key) => {
                        var _a, _b;
                        return {
                            formInputKey: key,
                            formInputValue: (_b = (_a = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.data[key]
                        };
                    })
                },
                academicQualificationsCriteria: (_2 = (_1 = (_0 = scholarship === null || scholarship === void 0 ? void 0 : scholarship.tags) === null || _0 === void 0 ? void 0 : _0.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) === "edu_qual"; })) === null || _1 === void 0 ? void 0 : _1.list) === null || _2 === void 0 ? void 0 : _2.map((li) => {
                    var _a, _b;
                    return {
                        code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                        name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                        value: li === null || li === void 0 ? void 0 : li.value
                    };
                }),
                finStatusCriteria: (_5 = (_4 = (_3 = scholarship === null || scholarship === void 0 ? void 0 : scholarship.tags) === null || _3 === void 0 ? void 0 : _3.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) === "fin_status"; })) === null || _4 === void 0 ? void 0 : _4.list) === null || _5 === void 0 ? void 0 : _5.map((li) => {
                    var _a, _b;
                    return {
                        code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                        name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                        value: li === null || li === void 0 ? void 0 : li.value
                    };
                }),
                benefits: (_8 = (_7 = (_6 = scholarship === null || scholarship === void 0 ? void 0 : scholarship.tags) === null || _6 === void 0 ? void 0 : _6.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) === "benefits"; })) === null || _7 === void 0 ? void 0 : _7.list) === null || _8 === void 0 ? void 0 : _8.map((li) => {
                    var _a, _b;
                    return {
                        code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                        name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                        value: li === null || li === void 0 ? void 0 : li.value
                    };
                })
            };
        })
    };
    return { context, scholarshipProvider };
};
exports.buildInitResponse = buildInitResponse;
const buildConfirmRequest = (input = {}) => {
    var _a, _b;
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { category: "scholarships", action: "confirm" }));
    const { scholarshipProvider = {} } = input;
    const message = {
        order: {
            type: "DEFAULT",
            provider: {
                id: scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.id,
                descriptor: {
                    name: scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.name,
                    short_desc: scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.description
                },
                rateable: false
            },
            items: (_a = scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.scholarships) === null || _a === void 0 ? void 0 : _a.map((scholarship) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                const tags = [];
                if ((scholarship === null || scholarship === void 0 ? void 0 : scholarship.academicQualificationsCriteria) &&
                    (scholarship === null || scholarship === void 0 ? void 0 : scholarship.academicQualificationsCriteria.length)) {
                    tags.push({
                        display: true,
                        descriptor: {
                            code: "edu_qual",
                            name: "Academic Eligibility"
                        },
                        list: (_a = scholarship === null || scholarship === void 0 ? void 0 : scholarship.academicQualificationsCriteria) === null || _a === void 0 ? void 0 : _a.map((quali) => {
                            return {
                                descriptor: {
                                    code: quali === null || quali === void 0 ? void 0 : quali.code,
                                    name: quali === null || quali === void 0 ? void 0 : quali.name
                                },
                                value: (quali === null || quali === void 0 ? void 0 : quali.code) === "passing_year"
                                    ? `${quali === null || quali === void 0 ? void 0 : quali.value}`
                                    : quali === null || quali === void 0 ? void 0 : quali.value,
                                display: (quali === null || quali === void 0 ? void 0 : quali.code) === "passing_year" ? false : true
                            };
                        })
                    });
                }
                if ((scholarship === null || scholarship === void 0 ? void 0 : scholarship.finStatusCriteria) &&
                    (scholarship === null || scholarship === void 0 ? void 0 : scholarship.finStatusCriteria.length)) {
                    tags.push({
                        display: true,
                        descriptor: {
                            code: "fin_status",
                            name: "Financial Status"
                        },
                        list: (_b = scholarship === null || scholarship === void 0 ? void 0 : scholarship.finStatusCriteria) === null || _b === void 0 ? void 0 : _b.map((stats) => {
                            return {
                                descriptor: {
                                    code: stats === null || stats === void 0 ? void 0 : stats.code,
                                    name: stats === null || stats === void 0 ? void 0 : stats.name
                                },
                                value: stats === null || stats === void 0 ? void 0 : stats.value,
                                display: true
                            };
                        })
                    });
                }
                if ((scholarship === null || scholarship === void 0 ? void 0 : scholarship.benefits) && (scholarship === null || scholarship === void 0 ? void 0 : scholarship.benefits.length)) {
                    tags.push({
                        display: true,
                        descriptor: {
                            code: "benefits",
                            name: "Benefits"
                        },
                        list: (_c = scholarship === null || scholarship === void 0 ? void 0 : scholarship.benefits) === null || _c === void 0 ? void 0 : _c.map((benef) => {
                            return {
                                descriptor: {
                                    code: benef === null || benef === void 0 ? void 0 : benef.code,
                                    name: benef === null || benef === void 0 ? void 0 : benef.name
                                },
                                value: benef === null || benef === void 0 ? void 0 : benef.value,
                                display: true
                            };
                        })
                    });
                }
                return {
                    id: scholarship === null || scholarship === void 0 ? void 0 : scholarship.id,
                    descriptor: {
                        name: scholarship === null || scholarship === void 0 ? void 0 : scholarship.name,
                        short_desc: scholarship === null || scholarship === void 0 ? void 0 : scholarship.description
                    },
                    price: {
                        currency: (_d = scholarship === null || scholarship === void 0 ? void 0 : scholarship.amount) === null || _d === void 0 ? void 0 : _d.currency,
                        value: `${(_e = scholarship === null || scholarship === void 0 ? void 0 : scholarship.amount) === null || _e === void 0 ? void 0 : _e.amount}`
                    },
                    xinput: {
                        required: true,
                        form: {
                            url: (_f = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _f === void 0 ? void 0 : _f.formUrl,
                            data: {
                                name: (_h = (_g = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _g === void 0 ? void 0 : _g.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "name")) === null || _h === void 0 ? void 0 : _h.formInputValue,
                                phone: `${(_k = (_j = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _j === void 0 ? void 0 : _j.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "phone")) === null || _k === void 0 ? void 0 : _k.formInputValue}`,
                                address: (_m = (_l = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _l === void 0 ? void 0 : _l.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "address")) === null || _m === void 0 ? void 0 : _m.formInputValue,
                                needOfScholarship: (_p = (_o = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _o === void 0 ? void 0 : _o.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "needOfScholarship")) === null || _p === void 0 ? void 0 : _p.formInputValue,
                                docUrl: (_r = (_q = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _q === void 0 ? void 0 : _q.data.find((elem) => (elem === null || elem === void 0 ? void 0 : elem.formInputKey) === "docUrl")) === null || _r === void 0 ? void 0 : _r.formInputValue
                            },
                            mime_type: (_s = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _s === void 0 ? void 0 : _s.formMimeType,
                            submission_id: (_t = scholarship === null || scholarship === void 0 ? void 0 : scholarship.additionalFormData) === null || _t === void 0 ? void 0 : _t.submissionId
                        }
                    },
                    rateable: false,
                    tags: tags,
                    category_ids: [scholarship === null || scholarship === void 0 ? void 0 : scholarship.categoryId]
                };
            }),
            fulfillments: (_b = scholarshipProvider === null || scholarshipProvider === void 0 ? void 0 : scholarshipProvider.scholarships) === null || _b === void 0 ? void 0 : _b.map((scholarship) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return {
                    id: (_a = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _a === void 0 ? void 0 : _a.id,
                    type: (_b = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _b === void 0 ? void 0 : _b.type,
                    tracking: false,
                    customer: {
                        person: {
                            gender: "Male",
                            name: "Test"
                        }
                    },
                    contact: {
                        phone: (_d = (_c = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _c === void 0 ? void 0 : _c.supportContact) === null || _d === void 0 ? void 0 : _d.phone,
                        email: (_f = (_e = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _e === void 0 ? void 0 : _e.supportContact) === null || _f === void 0 ? void 0 : _f.email
                    },
                    stops: [
                        {
                            type: "APPLICATION-START",
                            time: {
                                timestamp: (_g = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _g === void 0 ? void 0 : _g.applicationStartDate
                            }
                        },
                        {
                            type: "APPLICATION-END",
                            time: {
                                timestamp: (_h = scholarship === null || scholarship === void 0 ? void 0 : scholarship.scholarshipDetails) === null || _h === void 0 ? void 0 : _h.applicationEndDate
                            }
                        }
                    ]
                };
            })
        }
    };
    return { payload: { context, message } };
};
exports.buildConfirmRequest = buildConfirmRequest;
const buildConfirmResponse = (response = {}, input = {}) => {
    var _a, _b, _c, _d, _e;
    if (!response.responses.length) {
        return {
            context: {},
            scholarshipApplicationId: "",
            scholarshipApplicationStatus: "",
            scholarshipProvider: {}
        };
    }
    const actualResponse = response === null || response === void 0 ? void 0 : response.responses[0];
    const context = {
        transactionId: (_a = actualResponse === null || actualResponse === void 0 ? void 0 : actualResponse.context) === null || _a === void 0 ? void 0 : _a.transaction_id,
        bppId: (_b = actualResponse === null || actualResponse === void 0 ? void 0 : actualResponse.context) === null || _b === void 0 ? void 0 : _b.bpp_id,
        bppUri: (_c = actualResponse === null || actualResponse === void 0 ? void 0 : actualResponse.context) === null || _c === void 0 ? void 0 : _c.bpp_uri
    };
    const { order = {} } = actualResponse === null || actualResponse === void 0 ? void 0 : actualResponse.message;
    const fulfillment = order === null || order === void 0 ? void 0 : order.fulfillments[0];
    const provider = order === null || order === void 0 ? void 0 : order.provider;
    const scholarshipApplicationId = order === null || order === void 0 ? void 0 : order.id;
    const scholarshipApplicationStatus = order === null || order === void 0 ? void 0 : order.status;
    const scholarshipProvider = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_d = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _d === void 0 ? void 0 : _d.name,
        description: (_e = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _e === void 0 ? void 0 : _e.short_desc,
        scholarships: order === null || order === void 0 ? void 0 : order.items.map((scholarship) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
            return {
                id: scholarship === null || scholarship === void 0 ? void 0 : scholarship.id,
                name: (_a = scholarship === null || scholarship === void 0 ? void 0 : scholarship.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                description: (_b = scholarship === null || scholarship === void 0 ? void 0 : scholarship.descriptor) === null || _b === void 0 ? void 0 : _b.short_desc,
                categoryId: ((_c = scholarship === null || scholarship === void 0 ? void 0 : scholarship.category_ids) === null || _c === void 0 ? void 0 : _c.length)
                    ? scholarship === null || scholarship === void 0 ? void 0 : scholarship.category_ids[0]
                    : "",
                amount: {
                    amount: parseInt((_d = scholarship === null || scholarship === void 0 ? void 0 : scholarship.price) === null || _d === void 0 ? void 0 : _d.value),
                    currency: (_e = scholarship === null || scholarship === void 0 ? void 0 : scholarship.price) === null || _e === void 0 ? void 0 : _e.currency
                },
                scholarshipDetails: {
                    id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                    type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                    applicationStartDate: (_h = (_g = (_f = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.stops) === null || _f === void 0 ? void 0 : _f.find((stp) => (stp === null || stp === void 0 ? void 0 : stp.type) === "APPLICATION-START")) === null || _g === void 0 ? void 0 : _g.time) === null || _h === void 0 ? void 0 : _h.timestamp,
                    applicationEndDate: (_l = (_k = (_j = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.stops) === null || _j === void 0 ? void 0 : _j.find((stp) => (stp === null || stp === void 0 ? void 0 : stp.type) === "APPLICATION-END")) === null || _k === void 0 ? void 0 : _k.time) === null || _l === void 0 ? void 0 : _l.timestamp,
                    supportContact: {
                        name: (_m = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _m === void 0 ? void 0 : _m.email,
                        phone: (_o = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _o === void 0 ? void 0 : _o.phone,
                        email: (_p = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _p === void 0 ? void 0 : _p.email
                    },
                    scholarshipRequestor: (_r = (_q = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _q === void 0 ? void 0 : _q.form) === null || _r === void 0 ? void 0 : _r.data
                },
                additionalFormData: {
                    formUrl: (_t = (_s = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _s === void 0 ? void 0 : _s.form) === null || _t === void 0 ? void 0 : _t.url,
                    formMimeType: (_v = (_u = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _u === void 0 ? void 0 : _u.form) === null || _v === void 0 ? void 0 : _v.mime_type,
                    submissionId: (_x = (_w = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _w === void 0 ? void 0 : _w.form) === null || _x === void 0 ? void 0 : _x.submission_id,
                    data: Object.keys((_z = (_y = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _y === void 0 ? void 0 : _y.form) === null || _z === void 0 ? void 0 : _z.data).map((key) => {
                        var _a, _b, _c, _d;
                        return {
                            formInputKey: key,
                            formInputValue: key === "phone"
                                ? Number((_b = (_a = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.data[key])
                                : (_d = (_c = scholarship === null || scholarship === void 0 ? void 0 : scholarship.xinput) === null || _c === void 0 ? void 0 : _c.form) === null || _d === void 0 ? void 0 : _d.data[key]
                        };
                    })
                },
                academicQualificationsCriteria: (_2 = (_1 = (_0 = scholarship === null || scholarship === void 0 ? void 0 : scholarship.tags) === null || _0 === void 0 ? void 0 : _0.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) === "edu_qual"; })) === null || _1 === void 0 ? void 0 : _1.list) === null || _2 === void 0 ? void 0 : _2.map((li) => {
                    var _a, _b, _c;
                    return {
                        code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                        name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                        value: ((_c = li === null || li === void 0 ? void 0 : li.descriptor) === null || _c === void 0 ? void 0 : _c.code) === "passing_year"
                            ? Number(li === null || li === void 0 ? void 0 : li.value)
                            : li === null || li === void 0 ? void 0 : li.value
                    };
                }),
                finStatusCriteria: (_5 = (_4 = (_3 = scholarship === null || scholarship === void 0 ? void 0 : scholarship.tags) === null || _3 === void 0 ? void 0 : _3.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) === "fin_status"; })) === null || _4 === void 0 ? void 0 : _4.list) === null || _5 === void 0 ? void 0 : _5.map((li) => {
                    var _a, _b;
                    return {
                        code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                        name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                        value: li === null || li === void 0 ? void 0 : li.value
                    };
                }),
                benefits: (_8 = (_7 = (_6 = scholarship === null || scholarship === void 0 ? void 0 : scholarship.tags) === null || _6 === void 0 ? void 0 : _6.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) === "benefits"; })) === null || _7 === void 0 ? void 0 : _7.list) === null || _8 === void 0 ? void 0 : _8.map((li) => {
                    var _a, _b;
                    return {
                        code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                        name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                        value: li === null || li === void 0 ? void 0 : li.value
                    };
                })
            };
        })
    };
    return {
        context,
        scholarshipApplicationId,
        scholarshipApplicationStatus,
        scholarshipProvider
    };
};
exports.buildConfirmResponse = buildConfirmResponse;
const buildStatusRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { category: "scholarships", action: "status" }));
    const message = {
        order_id: input === null || input === void 0 ? void 0 : input.scholarshipApplicationId
    };
    return { payload: { context, message } };
};
exports.buildStatusRequest = buildStatusRequest;
const buildStatusResponse = (res = {}, input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const response = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!response)
        return { status: 200 };
    const context = {
        transactionId: (_c = response === null || response === void 0 ? void 0 : response.context) === null || _c === void 0 ? void 0 : _c.transaction_id,
        bppId: (_d = response === null || response === void 0 ? void 0 : response.context) === null || _d === void 0 ? void 0 : _d.bpp_id,
        bppUri: (_e = response === null || response === void 0 ? void 0 : response.context) === null || _e === void 0 ? void 0 : _e.bpp_uri
    };
    const provider = (_g = (_f = response === null || response === void 0 ? void 0 : response.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.provider;
    const scholarshipApplicationId = (_j = (_h = response === null || response === void 0 ? void 0 : response.message) === null || _h === void 0 ? void 0 : _h.order) === null || _j === void 0 ? void 0 : _j.id;
    const scholarshipProviders = [
        {
            id: provider === null || provider === void 0 ? void 0 : provider.id,
            name: (_k = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _k === void 0 ? void 0 : _k.name,
            description: (_m = (_l = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _l === void 0 ? void 0 : _l.long_desc) !== null && _m !== void 0 ? _m : (_o = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _o === void 0 ? void 0 : _o.short_desc,
            scholarships: (_r = (_q = (_p = response === null || response === void 0 ? void 0 : response.message) === null || _p === void 0 ? void 0 : _p.order) === null || _q === void 0 ? void 0 : _q.items) === null || _r === void 0 ? void 0 : _r.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return ({
                    id: item === null || item === void 0 ? void 0 : item.id,
                    name: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
                    amount: {
                        amount: (_c = item === null || item === void 0 ? void 0 : item.price) === null || _c === void 0 ? void 0 : _c.value,
                        currency: (_d = item === null || item === void 0 ? void 0 : item.price) === null || _d === void 0 ? void 0 : _d.currency
                    },
                    scholarshipDetails: (_h = (_g = (_f = (_e = response === null || response === void 0 ? void 0 : response.message) === null || _e === void 0 ? void 0 : _e.order) === null || _f === void 0 ? void 0 : _f.fulfillments) === null || _g === void 0 ? void 0 : _g.map((fulfillment) => {
                        var _a, _b;
                        return ({
                            id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                            type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                            scholarshipStatus: { code: (_b = (_a = response === null || response === void 0 ? void 0 : response.message) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.status }
                        });
                    })) === null || _h === void 0 ? void 0 : _h[0]
                });
            })
        }
    ];
    return { data: { context, scholarshipApplicationId, scholarshipProviders } };
};
exports.buildStatusResponse = buildStatusResponse;

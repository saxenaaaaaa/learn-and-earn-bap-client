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
exports.buildInitResponse = exports.buildInitRequest = exports.buildCancelResponse = exports.buildCancelRequest = exports.buildStatusResponse = exports.buildStatusRequest = exports.buildConfirmResponse = exports.buildConfirmRequest = exports.buildSelectResponse = exports.buildSelectRequest = exports.buildSavedAppliedCategoryResponse = exports.buildSearchResponse = exports.buildSearchRequest = exports.buildOnSearchMergedResponse = exports.buildContext = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f;
    const context = {
        domain: `${process.env.DOMAIN}${(_a = input === null || input === void 0 ? void 0 : input.category) !== null && _a !== void 0 ? _a : "mentoring"}`,
        action: (_b = input.action) !== null && _b !== void 0 ? _b : "",
        bap_id: process.env.BAP_ID || "",
        bap_uri: process.env.BAP_URI || "",
        timestamp: (_c = input.timestamp) !== null && _c !== void 0 ? _c : (0, moment_1.default)().toISOString(),
        message_id: (_d = input === null || input === void 0 ? void 0 : input.messageId) !== null && _d !== void 0 ? _d : (0, uuid_1.v4)(),
        version: process.env.CORE_VERSION || ((_e = input === null || input === void 0 ? void 0 : input.core_version) !== null && _e !== void 0 ? _e : ""),
        ttl: "PT10M",
        transaction_id: (_f = input === null || input === void 0 ? void 0 : input.transactionId) !== null && _f !== void 0 ? _f : (0, uuid_1.v4)()
    };
    if (input === null || input === void 0 ? void 0 : input.bppId) {
        context.bpp_id = input === null || input === void 0 ? void 0 : input.bppId;
    }
    if (input === null || input === void 0 ? void 0 : input.bppUri) {
        context.bpp_uri = input === null || input === void 0 ? void 0 : input.bppUri;
    }
    return context;
};
exports.buildContext = buildContext;
const buildOnSearchMergedResponse = (response = {}, body = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    return (0, exports.buildSearchResponse)(response.searchRes, body, (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.itemRes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.mentorship, (_f = (_e = (_d = response === null || response === void 0 ? void 0 : response.itemRes) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.mentorship);
});
exports.buildOnSearchMergedResponse = buildOnSearchMergedResponse;
const buildSearchRequest = (input = {}) => {
    var _a, _b, _c, _d;
    const context = (0, exports.buildContext)({
        action: "search",
        category: "mentoring"
    });
    const intent = {};
    const optional = {};
    if ((_a = input === null || input === void 0 ? void 0 : input.sessionTitle) === null || _a === void 0 ? void 0 : _a.key) {
        intent.item = {
            descriptor: {
                name: (_b = input === null || input === void 0 ? void 0 : input.sessionTitle) === null || _b === void 0 ? void 0 : _b.key
            }
        };
    }
    if ((_c = input === null || input === void 0 ? void 0 : input.mentor) === null || _c === void 0 ? void 0 : _c.name) {
        intent.agent = {
            person: {
                name: (_d = input === null || input === void 0 ? void 0 : input.mentor) === null || _d === void 0 ? void 0 : _d.name
            }
        };
    }
    if (input === null || input === void 0 ? void 0 : input.loggedInUserEmail) {
        optional.user = { "email": input === null || input === void 0 ? void 0 : input.loggedInUserEmail };
    }
    return { payload: { context, message: { intent } }, optional };
};
exports.buildSearchRequest = buildSearchRequest;
const buildSearchResponse = (response = {}, body = {}, savedItems = [], appliedItems = []) => {
    var _a, _b, _c, _d;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const { providers } = (_d = input.message) === null || _d === void 0 ? void 0 : _d.catalog;
    const mentorshipProviders = providers === null || providers === void 0 ? void 0 : providers.map((provider) => {
        var _a, _b, _c, _d;
        return ({
            id: provider === null || provider === void 0 ? void 0 : provider.id,
            code: (_a = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _a === void 0 ? void 0 : _a.code,
            name: (_b = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _b === void 0 ? void 0 : _b.name,
            description: (_c = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _c === void 0 ? void 0 : _c.short_desc,
            mentorships: (_d = provider === null || provider === void 0 ? void 0 : provider.items) === null || _d === void 0 ? void 0 : _d.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                return ({
                    id: item === null || item === void 0 ? void 0 : item.id,
                    code: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                    name: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                    description: (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.short_desc,
                    longDescription: (_d = item === null || item === void 0 ? void 0 : item.descriptor) === null || _d === void 0 ? void 0 : _d.long_desc,
                    imageLocations: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.images) === null || _f === void 0 ? void 0 : _f.map((image) => image === null || image === void 0 ? void 0 : image.url),
                    categories: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _g === void 0 ? void 0 : _g.filter((category) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.category_ids) === null || _a === void 0 ? void 0 : _a.find((categoryId) => categoryId == (category === null || category === void 0 ? void 0 : category.id)); })) === null || _h === void 0 ? void 0 : _h.map((category) => { var _a, _b; return ({ id: category === null || category === void 0 ? void 0 : category.id, code: (_a = category === null || category === void 0 ? void 0 : category.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = category === null || category === void 0 ? void 0 : category.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
                    available: (_k = (_j = item === null || item === void 0 ? void 0 : item.quantity) === null || _j === void 0 ? void 0 : _j.available) === null || _k === void 0 ? void 0 : _k.count,
                    allocated: (_m = (_l = item === null || item === void 0 ? void 0 : item.quantity) === null || _l === void 0 ? void 0 : _l.allocated) === null || _m === void 0 ? void 0 : _m.count,
                    price: (_o = item === null || item === void 0 ? void 0 : item.price) === null || _o === void 0 ? void 0 : _o.value,
                    userSavedItem: !!(savedItems === null || savedItems === void 0 ? void 0 : savedItems.find((savedItem) => (savedItem === null || savedItem === void 0 ? void 0 : savedItem.mentorship_id) == (item === null || item === void 0 ? void 0 : item.id))),
                    userAppliedItem: !!(appliedItems === null || appliedItems === void 0 ? void 0 : appliedItems.find((appliedItem) => (appliedItem === null || appliedItem === void 0 ? void 0 : appliedItem.mentorship_id) == (item === null || item === void 0 ? void 0 : item.id))),
                    mentorshipSessions: (_q = (_p = provider === null || provider === void 0 ? void 0 : provider.fulfillments) === null || _p === void 0 ? void 0 : _p.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => fulfillmentId == (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id)); })) === null || _q === void 0 ? void 0 : _q.map((fulfillment) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
                        return ({
                            id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                            language: (_a = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.language) === null || _a === void 0 ? void 0 : _a[0],
                            timingStart: (_c = (_b = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _b === void 0 ? void 0 : _b.range) === null || _c === void 0 ? void 0 : _c.start,
                            timingEnd: (_e = (_d = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _d === void 0 ? void 0 : _d.range) === null || _e === void 0 ? void 0 : _e.end,
                            type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                            status: (_k = (_j = (_h = (_g = (_f = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags) === null || _f === void 0 ? void 0 : _f.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "status"; })) === null || _g === void 0 ? void 0 : _g.list) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.descriptor) === null || _k === void 0 ? void 0 : _k.name,
                            timezone: (_q = (_p = (_o = (_m = (_l = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags) === null || _l === void 0 ? void 0 : _l.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "timeZone"; })) === null || _m === void 0 ? void 0 : _m.list) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.descriptor) === null || _q === void 0 ? void 0 : _q.name,
                            userSavedItem: !!(savedItems === null || savedItems === void 0 ? void 0 : savedItems.find((savedItem) => (savedItem === null || savedItem === void 0 ? void 0 : savedItem.mentorshipSession_id) == (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id))),
                            userAppliedItem: !!(appliedItems === null || appliedItems === void 0 ? void 0 : appliedItems.find((appliedItem) => (appliedItem === null || appliedItem === void 0 ? void 0 : appliedItem.mentorshipSession_id) == (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id))),
                            mentor: {
                                id: (_s = (_r = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _r === void 0 ? void 0 : _r.person) === null || _s === void 0 ? void 0 : _s.id,
                                name: (_u = (_t = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _t === void 0 ? void 0 : _t.person) === null || _u === void 0 ? void 0 : _u.name,
                                gender: (_w = (_v = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _v === void 0 ? void 0 : _v.person) === null || _w === void 0 ? void 0 : _w.gender,
                                image: (_y = (_x = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _x === void 0 ? void 0 : _x.person) === null || _y === void 0 ? void 0 : _y.image,
                                rating: (_0 = (_z = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _z === void 0 ? void 0 : _z.person) === null || _0 === void 0 ? void 0 : _0.rating,
                                aboutMentor: (_5 = (_4 = (_3 = (_2 = (_1 = item === null || item === void 0 ? void 0 : item.tags) === null || _1 === void 0 ? void 0 : _1.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "about_mentor"; })) === null || _2 === void 0 ? void 0 : _2.list) === null || _3 === void 0 ? void 0 : _3.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "about_mentor"; })) === null || _4 === void 0 ? void 0 : _4.descriptor) === null || _5 === void 0 ? void 0 : _5.name,
                                qualification: (_10 = (_9 = (_8 = (_7 = (_6 = item === null || item === void 0 ? void 0 : item.tags) === null || _6 === void 0 ? void 0 : _6.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "qualification"; })) === null || _7 === void 0 ? void 0 : _7.list) === null || _8 === void 0 ? void 0 : _8.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "qualification"; })) === null || _9 === void 0 ? void 0 : _9.descriptor) === null || _10 === void 0 ? void 0 : _10.name,
                                experience: (_15 = (_14 = (_13 = (_12 = (_11 = item === null || item === void 0 ? void 0 : item.tasg) === null || _11 === void 0 ? void 0 : _11.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "professional_experience"; })) === null || _12 === void 0 ? void 0 : _12.list) === null || _13 === void 0 ? void 0 : _13.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "professional_experience"; })) === null || _14 === void 0 ? void 0 : _14.descriptor) === null || _15 === void 0 ? void 0 : _15.name,
                                totalMeetings: (_20 = (_19 = (_18 = (_17 = (_16 = item === null || item === void 0 ? void 0 : item.tags) === null || _16 === void 0 ? void 0 : _16.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "total_meetings"; })) === null || _17 === void 0 ? void 0 : _17.list) === null || _18 === void 0 ? void 0 : _18.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "total_meetings"; })) === null || _19 === void 0 ? void 0 : _19.descriptor) === null || _20 === void 0 ? void 0 : _20.name,
                                specialisation: (_25 = (_24 = (_23 = (_22 = (_21 = item === null || item === void 0 ? void 0 : item.tags) === null || _21 === void 0 ? void 0 : _21.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "specialist_in"; })) === null || _22 === void 0 ? void 0 : _22.list) === null || _23 === void 0 ? void 0 : _23.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "specialist_in"; })) === null || _24 === void 0 ? void 0 : _24.descriptor) === null || _25 === void 0 ? void 0 : _25.name,
                            }
                        });
                    }),
                    recommendedFor: (_t = (_s = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => (tag === null || tag === void 0 ? void 0 : tag.code) == "recommended_for")) === null || _s === void 0 ? void 0 : _s.list) === null || _t === void 0 ? void 0 : _t.map((li) => { var _a, _b; return ({ recommendationForCode: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, recommendationForName: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
                });
            }),
        });
    });
    return { data: { context, mentorshipProviders } };
};
exports.buildSearchResponse = buildSearchResponse;
const buildSavedAppliedCategoryResponse = (savedResponse = {}, appliedResponse = {}) => {
    var _a, _b;
    const savedInput = (_a = savedResponse === null || savedResponse === void 0 ? void 0 : savedResponse.data) === null || _a === void 0 ? void 0 : _a.mentorship;
    const appliedInput = (_b = appliedResponse === null || appliedResponse === void 0 ? void 0 : appliedResponse.data) === null || _b === void 0 ? void 0 : _b.mentorship;
    const mentorMap = {
        saved: {}, applied: {}
    };
    if (savedResponse === null || savedResponse === void 0 ? void 0 : savedResponse.data) {
        savedInput.forEach(({ mentorship_id, mentorshipSession_id }) => {
            mentorMap['saved'][mentorship_id] = true;
            if (mentorshipSession_id) {
                mentorMap['saved'][mentorship_id] = {};
                mentorMap['saved'][mentorship_id][mentorshipSession_id] = true;
            }
        });
    }
    if (appliedResponse === null || appliedResponse === void 0 ? void 0 : appliedResponse.data) {
        appliedInput.forEach(({ mentorship_id, mentorshipSession_id }) => {
            mentorMap['applied'][mentorship_id] = true;
            if (mentorshipSession_id) {
                mentorMap['applied'][mentorship_id] = {};
                mentorMap['applied'][mentorship_id][mentorshipSession_id] = true;
            }
        });
    }
    return mentorMap;
};
exports.buildSavedAppliedCategoryResponse = buildSavedAppliedCategoryResponse;
const buildSelectRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { action: "select", category: "mentoring" }));
    const message = { order: { item: { id: input === null || input === void 0 ? void 0 : input.mentorshipId } } };
    return { payload: { context, message } };
};
exports.buildSelectRequest = buildSelectRequest;
const buildSelectResponse = (response = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_e = (_d = input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const mentorshipProvider = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        code: (_f = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _f === void 0 ? void 0 : _f.code,
        name: (_g = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _g === void 0 ? void 0 : _g.name,
        description: (_h = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _h === void 0 ? void 0 : _h.short_desc,
        mentorships: (_j = provider === null || provider === void 0 ? void 0 : provider.items) === null || _j === void 0 ? void 0 : _j.map((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            return ({
                id: item === null || item === void 0 ? void 0 : item.id,
                code: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                name: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                description: (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.short_desc,
                longDescription: (_d = item === null || item === void 0 ? void 0 : item.descriptor) === null || _d === void 0 ? void 0 : _d.long_desc,
                imageLocations: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.images) === null || _f === void 0 ? void 0 : _f.map((image) => image === null || image === void 0 ? void 0 : image.url),
                categories: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _g === void 0 ? void 0 : _g.filter((category) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.category_ids) === null || _a === void 0 ? void 0 : _a.find((categoryId) => categoryId == (category === null || category === void 0 ? void 0 : category.id)); })) === null || _h === void 0 ? void 0 : _h.map((category) => { var _a, _b; return ({ id: category === null || category === void 0 ? void 0 : category.id, code: (_a = category === null || category === void 0 ? void 0 : category.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = category === null || category === void 0 ? void 0 : category.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
                available: (_k = (_j = item === null || item === void 0 ? void 0 : item.quantity) === null || _j === void 0 ? void 0 : _j.available) === null || _k === void 0 ? void 0 : _k.count,
                allocated: (_m = (_l = item === null || item === void 0 ? void 0 : item.quantity) === null || _l === void 0 ? void 0 : _l.allocated) === null || _m === void 0 ? void 0 : _m.count,
                price: (_o = item === null || item === void 0 ? void 0 : item.price) === null || _o === void 0 ? void 0 : _o.value,
                mentorshipSessions: (_q = (_p = provider === null || provider === void 0 ? void 0 : provider.fulfillments) === null || _p === void 0 ? void 0 : _p.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => fulfillmentId == (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id)); })) === null || _q === void 0 ? void 0 : _q.map((fulfillment) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
                    return ({
                        id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                        language: (_a = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.language) === null || _a === void 0 ? void 0 : _a[0],
                        timingStart: (_c = (_b = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _b === void 0 ? void 0 : _b.range) === null || _c === void 0 ? void 0 : _c.start,
                        timingEnd: (_e = (_d = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _d === void 0 ? void 0 : _d.range) === null || _e === void 0 ? void 0 : _e.end,
                        type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                        status: (_k = (_j = (_h = (_g = (_f = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags) === null || _f === void 0 ? void 0 : _f.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "status"; })) === null || _g === void 0 ? void 0 : _g.list) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.descriptor) === null || _k === void 0 ? void 0 : _k.name,
                        timezone: (_q = (_p = (_o = (_m = (_l = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags) === null || _l === void 0 ? void 0 : _l.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "timeZone"; })) === null || _m === void 0 ? void 0 : _m.list) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.descriptor) === null || _q === void 0 ? void 0 : _q.name,
                        mentor: {
                            id: (_s = (_r = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _r === void 0 ? void 0 : _r.person) === null || _s === void 0 ? void 0 : _s.id,
                            name: (_u = (_t = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _t === void 0 ? void 0 : _t.person) === null || _u === void 0 ? void 0 : _u.name,
                            gender: (_w = (_v = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _v === void 0 ? void 0 : _v.person) === null || _w === void 0 ? void 0 : _w.gender,
                            image: (_y = (_x = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _x === void 0 ? void 0 : _x.person) === null || _y === void 0 ? void 0 : _y.image,
                            rating: (_0 = (_z = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _z === void 0 ? void 0 : _z.person) === null || _0 === void 0 ? void 0 : _0.rating,
                            aboutMentor: (_5 = (_4 = (_3 = (_2 = (_1 = item === null || item === void 0 ? void 0 : item.tags) === null || _1 === void 0 ? void 0 : _1.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "about_mentor"; })) === null || _2 === void 0 ? void 0 : _2.list) === null || _3 === void 0 ? void 0 : _3.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "about_mentor"; })) === null || _4 === void 0 ? void 0 : _4.descriptor) === null || _5 === void 0 ? void 0 : _5.name,
                            qualification: (_10 = (_9 = (_8 = (_7 = (_6 = item === null || item === void 0 ? void 0 : item.tags) === null || _6 === void 0 ? void 0 : _6.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "qualification"; })) === null || _7 === void 0 ? void 0 : _7.list) === null || _8 === void 0 ? void 0 : _8.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "qualification"; })) === null || _9 === void 0 ? void 0 : _9.descriptor) === null || _10 === void 0 ? void 0 : _10.name,
                            experience: (_15 = (_14 = (_13 = (_12 = (_11 = item === null || item === void 0 ? void 0 : item.tags) === null || _11 === void 0 ? void 0 : _11.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "professional_experience"; })) === null || _12 === void 0 ? void 0 : _12.list) === null || _13 === void 0 ? void 0 : _13.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "professional_experience"; })) === null || _14 === void 0 ? void 0 : _14.descriptor) === null || _15 === void 0 ? void 0 : _15.name,
                            totalMeetings: (_20 = (_19 = (_18 = (_17 = (_16 = item === null || item === void 0 ? void 0 : item.tags) === null || _16 === void 0 ? void 0 : _16.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "total_meetings"; })) === null || _17 === void 0 ? void 0 : _17.list) === null || _18 === void 0 ? void 0 : _18.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "total_meetings"; })) === null || _19 === void 0 ? void 0 : _19.descriptor) === null || _20 === void 0 ? void 0 : _20.name,
                            specialisation: (_25 = (_24 = (_23 = (_22 = (_21 = item === null || item === void 0 ? void 0 : item.tags) === null || _21 === void 0 ? void 0 : _21.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "specialist_in"; })) === null || _22 === void 0 ? void 0 : _22.list) === null || _23 === void 0 ? void 0 : _23.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "specialist_in"; })) === null || _24 === void 0 ? void 0 : _24.descriptor) === null || _25 === void 0 ? void 0 : _25.name,
                        }
                    });
                }),
                recommendedFor: (_t = (_s = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "recommended_for"; })) === null || _s === void 0 ? void 0 : _s.list) === null || _t === void 0 ? void 0 : _t.map((li) => { var _a, _b; return ({ recommendationForCode: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, recommendationForName: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
            });
        }),
    };
    return { data: { context, mentorshipProvider } };
};
exports.buildSelectResponse = buildSelectResponse;
const buildConfirmRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { category: "mentoring", action: "confirm" }));
    const message = {
        order: {
            items: [
                {
                    id: input === null || input === void 0 ? void 0 : input.mentorshipId
                }
            ],
            fulfillments: [
                {
                    id: input === null || input === void 0 ? void 0 : input.mentorshipSessionId
                }
            ],
            billing: input === null || input === void 0 ? void 0 : input.billing
        }
    };
    return { payload: { context, message } };
};
exports.buildConfirmRequest = buildConfirmRequest;
const buildConfirmResponse = (response = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const order = (_d = input === null || input === void 0 ? void 0 : input.message) === null || _d === void 0 ? void 0 : _d.order;
    const mentorshipApplicationId = order === null || order === void 0 ? void 0 : order.id;
    const mentorshipSession = {
        id: (_f = (_e = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.id,
        sessionJoinLinks: (_l = (_k = (_j = (_h = (_g = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.tags) === null || _j === void 0 ? void 0 : _j.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == 'joinLink'; })) === null || _k === void 0 ? void 0 : _k.list) === null || _l === void 0 ? void 0 : _l.map((li) => { var _a, _b; return ({ id: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, link: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
        language: (_p = (_o = (_m = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.language) === null || _p === void 0 ? void 0 : _p[0],
        timingStart: (_t = (_s = (_r = (_q = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.time) === null || _s === void 0 ? void 0 : _s.range) === null || _t === void 0 ? void 0 : _t.start,
        timingEnd: (_x = (_w = (_v = (_u = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _u === void 0 ? void 0 : _u[0]) === null || _v === void 0 ? void 0 : _v.time) === null || _w === void 0 ? void 0 : _w.range) === null || _x === void 0 ? void 0 : _x.end,
        type: (_z = (_y = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _y === void 0 ? void 0 : _y[0]) === null || _z === void 0 ? void 0 : _z.type,
        status: (_6 = (_5 = (_4 = (_3 = (_2 = (_1 = (_0 = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _0 === void 0 ? void 0 : _0[0]) === null || _1 === void 0 ? void 0 : _1.tags) === null || _2 === void 0 ? void 0 : _2.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "status"; })) === null || _3 === void 0 ? void 0 : _3.list) === null || _4 === void 0 ? void 0 : _4[0]) === null || _5 === void 0 ? void 0 : _5.descriptor) === null || _6 === void 0 ? void 0 : _6.name,
        timezone: (_13 = (_12 = (_11 = (_10 = (_9 = (_8 = (_7 = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _7 === void 0 ? void 0 : _7[0]) === null || _8 === void 0 ? void 0 : _8.tags) === null || _9 === void 0 ? void 0 : _9.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "timeZone"; })) === null || _10 === void 0 ? void 0 : _10.list) === null || _11 === void 0 ? void 0 : _11[0]) === null || _12 === void 0 ? void 0 : _12.descriptor) === null || _13 === void 0 ? void 0 : _13.name,
        mentor: {
            id: (_17 = (_16 = (_15 = (_14 = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _14 === void 0 ? void 0 : _14[0]) === null || _15 === void 0 ? void 0 : _15.agent) === null || _16 === void 0 ? void 0 : _16.person) === null || _17 === void 0 ? void 0 : _17.id,
            name: (_21 = (_20 = (_19 = (_18 = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _18 === void 0 ? void 0 : _18[0]) === null || _19 === void 0 ? void 0 : _19.agent) === null || _20 === void 0 ? void 0 : _20.person) === null || _21 === void 0 ? void 0 : _21.name,
            gender: (_25 = (_24 = (_23 = (_22 = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _22 === void 0 ? void 0 : _22[0]) === null || _23 === void 0 ? void 0 : _23.agent) === null || _24 === void 0 ? void 0 : _24.person) === null || _25 === void 0 ? void 0 : _25.gender,
            image: (_29 = (_28 = (_27 = (_26 = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _26 === void 0 ? void 0 : _26[0]) === null || _27 === void 0 ? void 0 : _27.agent) === null || _28 === void 0 ? void 0 : _28.person) === null || _29 === void 0 ? void 0 : _29.image,
            rating: (_33 = (_32 = (_31 = (_30 = order === null || order === void 0 ? void 0 : order.fulfillments) === null || _30 === void 0 ? void 0 : _30[0]) === null || _31 === void 0 ? void 0 : _31.agent) === null || _32 === void 0 ? void 0 : _32.person) === null || _33 === void 0 ? void 0 : _33.rating
        }
    };
    return { data: { context, mentorshipApplicationId, mentorshipSession } };
};
exports.buildConfirmResponse = buildConfirmResponse;
const buildStatusRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { action: "status", category: "mentoring" }));
    const message = {
        order_id: input === null || input === void 0 ? void 0 : input.mentorshipApplicationId
    };
    return { payload: { context, message } };
};
exports.buildStatusRequest = buildStatusRequest;
const buildStatusResponse = (response = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const order = (_d = input.message) === null || _d === void 0 ? void 0 : _d.order;
    const provider = order === null || order === void 0 ? void 0 : order.provider;
    const mentorshipApplicationId = order === null || order === void 0 ? void 0 : order.id;
    const mentorshipApplicationStatus = order === null || order === void 0 ? void 0 : order.state;
    const mentorshipProvider = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        code: (_e = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _e === void 0 ? void 0 : _e.code,
        name: (_f = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _f === void 0 ? void 0 : _f.name,
        description: (_g = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _g === void 0 ? void 0 : _g.short_desc,
        mentorships: (_h = provider === null || provider === void 0 ? void 0 : provider.items) === null || _h === void 0 ? void 0 : _h.map((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            return ({
                id: item === null || item === void 0 ? void 0 : item.id,
                code: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                name: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                description: (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.short_desc,
                longDescription: (_d = item === null || item === void 0 ? void 0 : item.descriptor) === null || _d === void 0 ? void 0 : _d.long_desc,
                imageLocations: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.images) === null || _f === void 0 ? void 0 : _f.map((image) => image === null || image === void 0 ? void 0 : image.url),
                categories: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _g === void 0 ? void 0 : _g.filter((category) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.category_ids) === null || _a === void 0 ? void 0 : _a.find((categoryId) => categoryId == (category === null || category === void 0 ? void 0 : category.id)); })) === null || _h === void 0 ? void 0 : _h.map((category) => { var _a, _b; return ({ id: category === null || category === void 0 ? void 0 : category.id, code: (_a = category === null || category === void 0 ? void 0 : category.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = category === null || category === void 0 ? void 0 : category.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
                available: (_k = (_j = item === null || item === void 0 ? void 0 : item.quantity) === null || _j === void 0 ? void 0 : _j.available) === null || _k === void 0 ? void 0 : _k.count,
                allocated: (_m = (_l = item === null || item === void 0 ? void 0 : item.quantity) === null || _l === void 0 ? void 0 : _l.allocated) === null || _m === void 0 ? void 0 : _m.count,
                price: (_o = item === null || item === void 0 ? void 0 : item.price) === null || _o === void 0 ? void 0 : _o.value,
                mentorshipSessions: (_q = (_p = provider === null || provider === void 0 ? void 0 : provider.fulfillments) === null || _p === void 0 ? void 0 : _p.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => fulfillmentId == (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id)); })) === null || _q === void 0 ? void 0 : _q.map((fulfillment) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
                    return ({
                        id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                        language: (_a = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.language) === null || _a === void 0 ? void 0 : _a[0],
                        timingStart: (_c = (_b = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _b === void 0 ? void 0 : _b.range) === null || _c === void 0 ? void 0 : _c.start,
                        timingEnd: (_e = (_d = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _d === void 0 ? void 0 : _d.range) === null || _e === void 0 ? void 0 : _e.end,
                        type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                        status: (_k = (_j = (_h = (_g = (_f = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags) === null || _f === void 0 ? void 0 : _f.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "status"; })) === null || _g === void 0 ? void 0 : _g.list) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.descriptor) === null || _k === void 0 ? void 0 : _k.name,
                        timezone: (_q = (_p = (_o = (_m = (_l = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags) === null || _l === void 0 ? void 0 : _l.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "timeZone"; })) === null || _m === void 0 ? void 0 : _m.list) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.descriptor) === null || _q === void 0 ? void 0 : _q.name,
                        mentor: {
                            id: (_s = (_r = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _r === void 0 ? void 0 : _r.person) === null || _s === void 0 ? void 0 : _s.id,
                            name: (_u = (_t = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _t === void 0 ? void 0 : _t.person) === null || _u === void 0 ? void 0 : _u.name,
                            gender: (_w = (_v = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _v === void 0 ? void 0 : _v.person) === null || _w === void 0 ? void 0 : _w.gender,
                            image: (_y = (_x = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _x === void 0 ? void 0 : _x.person) === null || _y === void 0 ? void 0 : _y.image,
                            rating: (_0 = (_z = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _z === void 0 ? void 0 : _z.person) === null || _0 === void 0 ? void 0 : _0.rating,
                            aboutMentor: (_5 = (_4 = (_3 = (_2 = (_1 = item === null || item === void 0 ? void 0 : item.tags) === null || _1 === void 0 ? void 0 : _1.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "about_mentor"; })) === null || _2 === void 0 ? void 0 : _2.list) === null || _3 === void 0 ? void 0 : _3.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "about_mentor"; })) === null || _4 === void 0 ? void 0 : _4.descriptor) === null || _5 === void 0 ? void 0 : _5.name,
                            qualification: (_10 = (_9 = (_8 = (_7 = (_6 = item === null || item === void 0 ? void 0 : item.tags) === null || _6 === void 0 ? void 0 : _6.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "qualification"; })) === null || _7 === void 0 ? void 0 : _7.list) === null || _8 === void 0 ? void 0 : _8.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "qualification"; })) === null || _9 === void 0 ? void 0 : _9.descriptor) === null || _10 === void 0 ? void 0 : _10.name,
                            experience: (_15 = (_14 = (_13 = (_12 = (_11 = item === null || item === void 0 ? void 0 : item.tags) === null || _11 === void 0 ? void 0 : _11.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "professional_experience"; })) === null || _12 === void 0 ? void 0 : _12.list) === null || _13 === void 0 ? void 0 : _13.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "professional_experience"; })) === null || _14 === void 0 ? void 0 : _14.descriptor) === null || _15 === void 0 ? void 0 : _15.name,
                            totalMeetings: (_20 = (_19 = (_18 = (_17 = (_16 = item === null || item === void 0 ? void 0 : item.tags) === null || _16 === void 0 ? void 0 : _16.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "total_meetings"; })) === null || _17 === void 0 ? void 0 : _17.list) === null || _18 === void 0 ? void 0 : _18.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "total_meetings"; })) === null || _19 === void 0 ? void 0 : _19.descriptor) === null || _20 === void 0 ? void 0 : _20.name,
                            specialisation: (_25 = (_24 = (_23 = (_22 = (_21 = item === null || item === void 0 ? void 0 : item.tags) === null || _21 === void 0 ? void 0 : _21.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "specialist_in"; })) === null || _22 === void 0 ? void 0 : _22.list) === null || _23 === void 0 ? void 0 : _23.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "specialist_in"; })) === null || _24 === void 0 ? void 0 : _24.descriptor) === null || _25 === void 0 ? void 0 : _25.name,
                        }
                    });
                }),
                recommendedFor: (_t = (_s = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "recommended_for"; })) === null || _s === void 0 ? void 0 : _s.list) === null || _t === void 0 ? void 0 : _t.map((li) => { var _a, _b; return ({ recommendationForCode: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, recommendationForName: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
            });
        }),
    };
    return { data: { context, mentorshipApplicationId, mentorshipApplicationStatus, mentorshipProvider } };
};
exports.buildStatusResponse = buildStatusResponse;
const buildCancelRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input.context), { action: "cancel", category: "mentoring" }));
    let message = { order_id: input === null || input === void 0 ? void 0 : input.mentorshipApplicationId };
    if (input === null || input === void 0 ? void 0 : input.mentorshipCancellationReasonId) {
        message = Object.assign(Object.assign({}, message), { cancellation_reason_id: `${input === null || input === void 0 ? void 0 : input.mentorshipCancellationReasonId}` });
    }
    if (input === null || input === void 0 ? void 0 : input.mentorshipCancellationReason) {
        message = Object.assign(Object.assign({}, message), { descriptor: { name: input === null || input === void 0 ? void 0 : input.mentorshipCancellationReason } });
    }
    return { payload: { context, message } };
};
exports.buildCancelRequest = buildCancelRequest;
const buildCancelResponse = (response = {}, input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const context = {
        transactionId: (_b = (_a = response === null || response === void 0 ? void 0 : response.responses[0]) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.transaction_id,
        bppId: (_d = (_c = response === null || response === void 0 ? void 0 : response.responses[0]) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0 ? void 0 : _d.bpp_id,
        bppUri: (_f = (_e = response === null || response === void 0 ? void 0 : response.responses[0]) === null || _e === void 0 ? void 0 : _e.context) === null || _f === void 0 ? void 0 : _f.bpp_uri
    };
    const mentorshipApplicationId = (_j = (_h = (_g = response === null || response === void 0 ? void 0 : response.responses[0]) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.order) === null || _j === void 0 ? void 0 : _j.id;
    return { context, mentorshipApplicationId };
};
exports.buildCancelResponse = buildCancelResponse;
const buildInitRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input.context), { action: "init", category: "mentoring" }));
    const message = {
        order: {
            items: [{ id: input === null || input === void 0 ? void 0 : input.mentorshipId }],
            fulfillments: [
                {
                    id: input === null || input === void 0 ? void 0 : input.mentorshipSessionId
                }
            ],
            billing: input === null || input === void 0 ? void 0 : input.billing
        }
    };
    return { payload: { context, message } };
};
exports.buildInitRequest = buildInitRequest;
const buildInitResponse = (response = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_e = (_d = input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const mentorshipProvider = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        code: (_f = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _f === void 0 ? void 0 : _f.code,
        name: (_g = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _g === void 0 ? void 0 : _g.name,
        description: (_h = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _h === void 0 ? void 0 : _h.short_desc,
        mentorships: (_j = provider === null || provider === void 0 ? void 0 : provider.items) === null || _j === void 0 ? void 0 : _j.map((item) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            return ({
                id: item === null || item === void 0 ? void 0 : item.id,
                code: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                name: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                description: (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.short_desc,
                longDescription: (_d = item === null || item === void 0 ? void 0 : item.descriptor) === null || _d === void 0 ? void 0 : _d.long_desc,
                imageLocations: (_f = (_e = item === null || item === void 0 ? void 0 : item.descriptor) === null || _e === void 0 ? void 0 : _e.images) === null || _f === void 0 ? void 0 : _f.map((image) => image === null || image === void 0 ? void 0 : image.url),
                categories: (_h = (_g = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _g === void 0 ? void 0 : _g.filter((category) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.category_ids) === null || _a === void 0 ? void 0 : _a.find((categoryId) => categoryId == (category === null || category === void 0 ? void 0 : category.id)); })) === null || _h === void 0 ? void 0 : _h.map((category) => { var _a, _b; return ({ id: category === null || category === void 0 ? void 0 : category.id, code: (_a = category === null || category === void 0 ? void 0 : category.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = category === null || category === void 0 ? void 0 : category.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
                available: (_k = (_j = item === null || item === void 0 ? void 0 : item.quantity) === null || _j === void 0 ? void 0 : _j.available) === null || _k === void 0 ? void 0 : _k.count,
                allocated: (_m = (_l = item === null || item === void 0 ? void 0 : item.quantity) === null || _l === void 0 ? void 0 : _l.allocated) === null || _m === void 0 ? void 0 : _m.count,
                price: (_o = item === null || item === void 0 ? void 0 : item.price) === null || _o === void 0 ? void 0 : _o.value,
                mentorshipSessions: (_q = (_p = provider === null || provider === void 0 ? void 0 : provider.fulfillments) === null || _p === void 0 ? void 0 : _p.filter((fulfillment) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.fulfillment_ids) === null || _a === void 0 ? void 0 : _a.find((fulfillmentId) => fulfillmentId == (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id)); })) === null || _q === void 0 ? void 0 : _q.map((fulfillment) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
                    return ({
                        id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
                        language: (_a = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.language) === null || _a === void 0 ? void 0 : _a[0],
                        timingStart: (_c = (_b = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _b === void 0 ? void 0 : _b.range) === null || _c === void 0 ? void 0 : _c.start,
                        timingEnd: (_e = (_d = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _d === void 0 ? void 0 : _d.range) === null || _e === void 0 ? void 0 : _e.end,
                        type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
                        status: (_k = (_j = (_h = (_g = (_f = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags) === null || _f === void 0 ? void 0 : _f.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "status"; })) === null || _g === void 0 ? void 0 : _g.list) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.descriptor) === null || _k === void 0 ? void 0 : _k.name,
                        timezone: (_q = (_p = (_o = (_m = (_l = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags) === null || _l === void 0 ? void 0 : _l.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "timeZone"; })) === null || _m === void 0 ? void 0 : _m.list) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.descriptor) === null || _q === void 0 ? void 0 : _q.name,
                        mentor: {
                            id: (_s = (_r = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _r === void 0 ? void 0 : _r.person) === null || _s === void 0 ? void 0 : _s.id,
                            name: (_u = (_t = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _t === void 0 ? void 0 : _t.person) === null || _u === void 0 ? void 0 : _u.name,
                            gender: (_w = (_v = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _v === void 0 ? void 0 : _v.person) === null || _w === void 0 ? void 0 : _w.gender,
                            image: (_y = (_x = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _x === void 0 ? void 0 : _x.person) === null || _y === void 0 ? void 0 : _y.image,
                            rating: (_0 = (_z = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _z === void 0 ? void 0 : _z.person) === null || _0 === void 0 ? void 0 : _0.rating,
                            aboutMentor: (_5 = (_4 = (_3 = (_2 = (_1 = item === null || item === void 0 ? void 0 : item.tags) === null || _1 === void 0 ? void 0 : _1.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "about_mentor"; })) === null || _2 === void 0 ? void 0 : _2.list) === null || _3 === void 0 ? void 0 : _3.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "about_mentor"; })) === null || _4 === void 0 ? void 0 : _4.descriptor) === null || _5 === void 0 ? void 0 : _5.name,
                            qualification: (_10 = (_9 = (_8 = (_7 = (_6 = item === null || item === void 0 ? void 0 : item.tags) === null || _6 === void 0 ? void 0 : _6.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "qualification"; })) === null || _7 === void 0 ? void 0 : _7.list) === null || _8 === void 0 ? void 0 : _8.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "qualification"; })) === null || _9 === void 0 ? void 0 : _9.descriptor) === null || _10 === void 0 ? void 0 : _10.name,
                            experience: (_15 = (_14 = (_13 = (_12 = (_11 = item === null || item === void 0 ? void 0 : item.tags) === null || _11 === void 0 ? void 0 : _11.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "professional_experience"; })) === null || _12 === void 0 ? void 0 : _12.list) === null || _13 === void 0 ? void 0 : _13.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "professional_experience"; })) === null || _14 === void 0 ? void 0 : _14.descriptor) === null || _15 === void 0 ? void 0 : _15.name,
                            totalMeetings: (_20 = (_19 = (_18 = (_17 = (_16 = item === null || item === void 0 ? void 0 : item.tags) === null || _16 === void 0 ? void 0 : _16.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "total_meetings"; })) === null || _17 === void 0 ? void 0 : _17.list) === null || _18 === void 0 ? void 0 : _18.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "total_meetings"; })) === null || _19 === void 0 ? void 0 : _19.descriptor) === null || _20 === void 0 ? void 0 : _20.name,
                            specialisation: (_25 = (_24 = (_23 = (_22 = (_21 = item === null || item === void 0 ? void 0 : item.tags) === null || _21 === void 0 ? void 0 : _21.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "specialist_in"; })) === null || _22 === void 0 ? void 0 : _22.list) === null || _23 === void 0 ? void 0 : _23.find((li) => { var _a; return ((_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "specialist_in"; })) === null || _24 === void 0 ? void 0 : _24.descriptor) === null || _25 === void 0 ? void 0 : _25.name,
                        }
                    });
                }),
                recommendedFor: (_t = (_s = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "recommended_for"; })) === null || _s === void 0 ? void 0 : _s.list) === null || _t === void 0 ? void 0 : _t.map((li) => { var _a, _b; return ({ recommendationForCode: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, recommendationForName: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name }); }),
            });
        }),
    };
    return { data: { context, mentorshipProvider } };
};
exports.buildInitResponse = buildInitResponse;

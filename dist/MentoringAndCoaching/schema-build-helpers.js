"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStatusResponse = exports.buildStatusRequest = exports.buildInitResponse = exports.buildInitRequest = exports.buildConfirmResponse = exports.buildConfirmRequest = exports.buildSelectResponse = exports.buildSelectRequest = exports.buildSearchResponse = exports.buildSearchRequest = exports.buildContext = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const context = {
        domain: `${process.env.DOMAIN}${(_a = input === null || input === void 0 ? void 0 : input.category) !== null && _a !== void 0 ? _a : "mentoring"}`,
        action: (_b = input.action) !== null && _b !== void 0 ? _b : "",
        bap_id: process.env.MENTORSHIP_BAP_ID || ((_c = input === null || input === void 0 ? void 0 : input.bppId) !== null && _c !== void 0 ? _c : ""),
        bap_uri: process.env.MENTORSHIP_BAP_URI || ((_d = input === null || input === void 0 ? void 0 : input.bppUri) !== null && _d !== void 0 ? _d : ""),
        timestamp: (_e = input.timestamp) !== null && _e !== void 0 ? _e : (0, moment_1.default)().toISOString(),
        message_id: (_f = input === null || input === void 0 ? void 0 : input.messageId) !== null && _f !== void 0 ? _f : (0, uuid_1.v4)(),
        version: process.env.CORE_VERSION || ((_g = input === null || input === void 0 ? void 0 : input.core_version) !== null && _g !== void 0 ? _g : ""),
        ttl: "PT10M",
        transaction_id: (_h = input === null || input === void 0 ? void 0 : input.transactionId) !== null && _h !== void 0 ? _h : (0, uuid_1.v4)()
    };
    return context;
};
exports.buildContext = buildContext;
const buildSearchRequest = (input = {}) => {
    var _a, _b, _c, _d;
    const context = (0, exports.buildContext)({
        action: "search",
        category: "mentoring"
    });
    const intent = {};
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
    return { payload: { context, message: intent } };
};
exports.buildSearchRequest = buildSearchRequest;
const buildSearchResponse = (response = {}, input = {}) => {
    var _a, _b, _c, _d;
    const context = { transactionId: (_a = response === null || response === void 0 ? void 0 : response.context) === null || _a === void 0 ? void 0 : _a.transaction_id };
    const mentorshipProviders = [];
    const responseMentorShipProviders = (_d = (_c = (_b = response === null || response === void 0 ? void 0 : response.message) === null || _b === void 0 ? void 0 : _b.catalog) === null || _c === void 0 ? void 0 : _c.providers) !== null && _d !== void 0 ? _d : [];
    responseMentorShipProviders.forEach((provider) => {
        var _a, _b, _c, _d;
        let rawProviderObjects = {};
        rawProviderObjects = {
            id: provider === null || provider === void 0 ? void 0 : provider.id,
            code: (_a = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _a === void 0 ? void 0 : _a.code,
            name: (_b = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _b === void 0 ? void 0 : _b.name,
            description: (_c = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _c === void 0 ? void 0 : _c.short_desc
        };
        const mentorships = [];
        const responseMentorships = (_d = provider === null || provider === void 0 ? void 0 : provider.items) !== null && _d !== void 0 ? _d : [];
        responseMentorships.forEach((mentorShip, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            let rawMentorShipObject = {};
            rawMentorShipObject = {
                id: mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.id,
                code: (_a = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                name: (_b = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                description: (_c = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.descriptor) === null || _c === void 0 ? void 0 : _c.short_desc,
                longDescription: (_d = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.descriptor) === null || _d === void 0 ? void 0 : _d.long_desc,
                imageLocations: (_e = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.descriptor) === null || _e === void 0 ? void 0 : _e.images,
                available: (_g = (_f = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.quantity) === null || _f === void 0 ? void 0 : _f.available) === null || _g === void 0 ? void 0 : _g.count,
                allocated: (_j = (_h = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.quantity) === null || _h === void 0 ? void 0 : _h.allocated) === null || _j === void 0 ? void 0 : _j.count,
                price: (_k = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.price) === null || _k === void 0 ? void 0 : _k.value
            };
            rawMentorShipObject.categories = provider === null || provider === void 0 ? void 0 : provider.categories.map((category) => {
                var _a, _b;
                return {
                    id: category === null || category === void 0 ? void 0 : category.id,
                    code: (_a = category === null || category === void 0 ? void 0 : category.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                    name: (_b = category === null || category === void 0 ? void 0 : category.descriptor) === null || _b === void 0 ? void 0 : _b.name
                };
            });
            rawMentorShipObject.recommendedFor = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.tags.filter((elem) => elem.code === "recommended_for").map((elem) => ({
                recommendationForCode: elem.list[0].code,
                recommendationForName: elem.list[0].name
            }));
            rawMentorShipObject.mentorshipSessions = mentorShip === null || mentorShip === void 0 ? void 0 : mentorShip.fulfillment_ids.map((id) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                let rawFulfillmentObj = {};
                const fullfilementFound = provider === null || provider === void 0 ? void 0 : provider.fulfillments.find((elem) => elem.id === id);
                if (Object.keys(fullfilementFound).length) {
                    rawFulfillmentObj = {
                        id: fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.id,
                        language: fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.language[0],
                        timingStart: (_b = (_a = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.time) === null || _a === void 0 ? void 0 : _a.range) === null || _b === void 0 ? void 0 : _b.start,
                        timingEnd: (_d = (_c = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.time) === null || _c === void 0 ? void 0 : _c.range) === null || _d === void 0 ? void 0 : _d.end,
                        type: fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.type,
                        status: (_e = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.tags.find((elem) => elem.code === "status").list[0]) === null || _e === void 0 ? void 0 : _e.name,
                        timezone: (_f = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.tags.find((elem) => elem.code === "timeZone").list[0]) === null || _f === void 0 ? void 0 : _f.name,
                        mentor: {
                            id: (_h = (_g = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.agent) === null || _g === void 0 ? void 0 : _g.person) === null || _h === void 0 ? void 0 : _h.id,
                            name: (_k = (_j = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.agent) === null || _j === void 0 ? void 0 : _j.person) === null || _k === void 0 ? void 0 : _k.name,
                            gender: (_o = (_m = (_l = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.agent) === null || _l === void 0 ? void 0 : _l.person) === null || _m === void 0 ? void 0 : _m.gender) !== null && _o !== void 0 ? _o : "Male",
                            image: (_r = (_q = (_p = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.agent) === null || _p === void 0 ? void 0 : _p.person) === null || _q === void 0 ? void 0 : _q.image) !== null && _r !== void 0 ? _r : "image location",
                            rating: (_u = (_t = (_s = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.agent) === null || _s === void 0 ? void 0 : _s.person) === null || _t === void 0 ? void 0 : _t.rating) !== null && _u !== void 0 ? _u : "4.9"
                        }
                    };
                }
                return rawFulfillmentObj;
            });
            mentorships.push(rawMentorShipObject);
            rawProviderObjects = Object.assign(Object.assign({}, rawProviderObjects), { mentorships });
        });
        mentorshipProviders.push(rawProviderObjects);
    });
    return { context, mentorshipProviders };
};
exports.buildSearchResponse = buildSearchResponse;
const buildSelectRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { action: "select", category: "mentoring" }));
    const message = { order: { item: { id: input === null || input === void 0 ? void 0 : input.mentorshipId } } };
    return { payload: { context, message } };
};
exports.buildSelectRequest = buildSelectRequest;
const buildSelectResponse = (response = {}, input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const context = {
        transactionId: (_a = response === null || response === void 0 ? void 0 : response.context) === null || _a === void 0 ? void 0 : _a.transaction_id,
        bppId: (_b = response === null || response === void 0 ? void 0 : response.context) === null || _b === void 0 ? void 0 : _b.bpp_id,
        bppUri: (_c = response === null || response === void 0 ? void 0 : response.context) === null || _c === void 0 ? void 0 : _c.bpp_uri
    };
    const { provider } = (_d = response === null || response === void 0 ? void 0 : response.message) === null || _d === void 0 ? void 0 : _d.order;
    const mentorshipProvider = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        code: (_e = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _e === void 0 ? void 0 : _e.code,
        name: (_f = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _f === void 0 ? void 0 : _f.name,
        description: (_g = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _g === void 0 ? void 0 : _g.short_desc
    };
    mentorshipProvider.mentorships = provider === null || provider === void 0 ? void 0 : provider.items.map((mentorship) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        let mentorshipResponse = {
            id: mentorship === null || mentorship === void 0 ? void 0 : mentorship.id,
            code: (_a = mentorship === null || mentorship === void 0 ? void 0 : mentorship.descriptor) === null || _a === void 0 ? void 0 : _a.code,
            name: (_b = mentorship === null || mentorship === void 0 ? void 0 : mentorship.descriptor) === null || _b === void 0 ? void 0 : _b.name,
            description: (_c = mentorship === null || mentorship === void 0 ? void 0 : mentorship.descriptor) === null || _c === void 0 ? void 0 : _c.short_desc,
            longDescription: (_d = mentorship === null || mentorship === void 0 ? void 0 : mentorship.descriptor) === null || _d === void 0 ? void 0 : _d.long_desc,
            imageLocations: (_e = mentorship === null || mentorship === void 0 ? void 0 : mentorship.descriptor) === null || _e === void 0 ? void 0 : _e.images,
            categories: provider === null || provider === void 0 ? void 0 : provider.categories.map((category) => {
                var _a, _b;
                let categoryResponse = {
                    id: category === null || category === void 0 ? void 0 : category.id,
                    code: (_a = category === null || category === void 0 ? void 0 : category.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                    name: (_b = category === null || category === void 0 ? void 0 : category.descriptor) === null || _b === void 0 ? void 0 : _b.name
                };
                return categoryResponse;
            }),
            available: (_g = (_f = mentorship === null || mentorship === void 0 ? void 0 : mentorship.quantity) === null || _f === void 0 ? void 0 : _f.available) === null || _g === void 0 ? void 0 : _g.count,
            allocated: (_j = (_h = mentorship === null || mentorship === void 0 ? void 0 : mentorship.quantity) === null || _h === void 0 ? void 0 : _h.allocated) === null || _j === void 0 ? void 0 : _j.count,
            price: (_k = mentorship === null || mentorship === void 0 ? void 0 : mentorship.price) === null || _k === void 0 ? void 0 : _k.value
        };
        mentorshipResponse.mentorshipSessions = (_l = mentorship === null || mentorship === void 0 ? void 0 : mentorship.fulfillment_ids) === null || _l === void 0 ? void 0 : _l.map((id) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            let fullfilmentObj = {};
            const fullfilementFound = provider === null || provider === void 0 ? void 0 : provider.fulfillments.find((fulfillment) => fulfillment.id === id);
            if (Object.keys(fullfilementFound).length) {
                fullfilmentObj = {
                    id: fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.id,
                    language: (_a = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.language[0]) !== null && _a !== void 0 ? _a : "",
                    timingStart: (_c = (_b = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.time) === null || _b === void 0 ? void 0 : _b.range) === null || _c === void 0 ? void 0 : _c.start,
                    timingEnd: (_e = (_d = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.time) === null || _d === void 0 ? void 0 : _d.range) === null || _e === void 0 ? void 0 : _e.end,
                    type: fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.type,
                    status: Object.keys(fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.tags.find((tag) => tag.code === "status")).length
                        ? (_g = (_f = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.tags.find((tag) => tag.code === "status")) === null || _f === void 0 ? void 0 : _f.list[0]) === null || _g === void 0 ? void 0 : _g.name
                        : "",
                    timezone: Object.keys(fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.tags.find((tag) => tag.code === "timeZone")).length
                        ? (_j = (_h = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.tags.find((tag) => tag.code === "timeZone")) === null || _h === void 0 ? void 0 : _h.list[0]) === null || _j === void 0 ? void 0 : _j.name
                        : "",
                    mentor: {
                        id: (_l = (_k = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.agent) === null || _k === void 0 ? void 0 : _k.person) === null || _l === void 0 ? void 0 : _l.id,
                        name: (_o = (_m = fullfilementFound === null || fullfilementFound === void 0 ? void 0 : fullfilementFound.agent) === null || _m === void 0 ? void 0 : _m.person) === null || _o === void 0 ? void 0 : _o.name,
                        gender: "Male",
                        image: "image location",
                        rating: "4.9"
                    }
                };
            }
            return fullfilmentObj;
        });
        mentorshipResponse.recommendedFor = mentorship === null || mentorship === void 0 ? void 0 : mentorship.tags.filter((elem) => elem.code === "recommended_for").map((elem) => ({
            recommendationForCode: elem.list[0].code,
            recommendationForName: elem.list[0].name
        }));
        return mentorshipResponse;
    });
    return {
        context,
        mentorshipProvider
    };
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
const buildConfirmResponse = (response = {}, input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const context = {
        transactionId: (_a = response === null || response === void 0 ? void 0 : response.context) === null || _a === void 0 ? void 0 : _a.transaction_id,
        bppId: (_b = response === null || response === void 0 ? void 0 : response.context) === null || _b === void 0 ? void 0 : _b.bpp_id,
        bppUri: (_c = response === null || response === void 0 ? void 0 : response.context) === null || _c === void 0 ? void 0 : _c.bpp_uri
    };
    const { order } = (_d = response === null || response === void 0 ? void 0 : response.message) !== null && _d !== void 0 ? _d : {};
    const mentorshipApplicationId = order === null || order === void 0 ? void 0 : order.id;
    const fulfillment = (order === null || order === void 0 ? void 0 : order.fulfillments.length) ? order === null || order === void 0 ? void 0 : order.fulfillments[0] : {};
    const sessionJoinLinks = Object.keys(fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags.find((tag) => tag.code === "joinLink")).length
        ? fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags.find((tag) => tag.code === "joinLink").list[0]
        : { code: "", name: "" };
    const mentorshipSession = {
        id: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.id,
        sessionJoinLinks: [
            {
                id: sessionJoinLinks.code,
                link: sessionJoinLinks.name
            }
        ],
        language: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.language[0],
        timingStart: (_f = (_e = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _e === void 0 ? void 0 : _e.range) === null || _f === void 0 ? void 0 : _f.start,
        timingEnd: (_h = (_g = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.time) === null || _g === void 0 ? void 0 : _g.range) === null || _h === void 0 ? void 0 : _h.end,
        type: fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.type,
        status: (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags.find((tag) => tag.code === "status"))
            ? (_k = (_j = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags.find((tag) => tag.code === "status")) === null || _j === void 0 ? void 0 : _j.list[0]) === null || _k === void 0 ? void 0 : _k.name
            : "Live",
        timezone: (fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags.find((tag) => tag.code === "timeZone"))
            ? (_m = (_l = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.tags.find((tag) => tag.code === "timeZone")) === null || _l === void 0 ? void 0 : _l.list[0]) === null || _m === void 0 ? void 0 : _m.name
            : "Asia/Calcutta",
        mentor: {
            id: (_p = (_o = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _o === void 0 ? void 0 : _o.person) === null || _p === void 0 ? void 0 : _p.id,
            name: (_r = (_q = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.agent) === null || _q === void 0 ? void 0 : _q.person) === null || _r === void 0 ? void 0 : _r.name,
            gender: "Male",
            image: "image location",
            rating: "4.9"
        }
    };
    return {
        mentorshipApplicationId,
        context,
        mentorshipSession
    };
};
exports.buildConfirmResponse = buildConfirmResponse;
const buildInitRequest = (input = {}) => { };
exports.buildInitRequest = buildInitRequest;
const buildInitResponse = () => { };
exports.buildInitResponse = buildInitResponse;
const buildStatusRequest = (input = {}) => { };
exports.buildStatusRequest = buildStatusRequest;
const buildStatusResponse = () => { };
exports.buildStatusResponse = buildStatusResponse;

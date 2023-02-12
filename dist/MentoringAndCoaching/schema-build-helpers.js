"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSearchResponse = exports.buildSearchRequest = exports.buildContext = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const context = {
        domain: `${process.env.DOMAIN}${(_a = input === null || input === void 0 ? void 0 : input.category) !== null && _a !== void 0 ? _a : "mentoring"}`,
        action: (_b = input.action) !== null && _b !== void 0 ? _b : "",
        bap_id: process.env.BAP_ID || ((_c = input === null || input === void 0 ? void 0 : input.bap_id) !== null && _c !== void 0 ? _c : ""),
        bap_uri: process.env.BAP_URI || ((_d = input === null || input === void 0 ? void 0 : input.bap_uri) !== null && _d !== void 0 ? _d : ""),
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

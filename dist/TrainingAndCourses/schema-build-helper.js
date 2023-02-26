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
exports.buildSelectResponse = exports.buildSelectRequest = exports.buildStatusResponse = exports.buildStatusRequest = exports.buildConfirmResponse = exports.buildConfirmRequest = exports.buildInitResponse = exports.buildInitRequest = exports.buildSavedAppliedCategoryResponse = exports.enrichCoursesWithRelevantJobs = exports.buildSearchResponse = exports.buildOnSearchMergedResponse = exports.buildSearchRequestWithJobSkill = exports.buildSearchRequestWithJobRole = exports.buildSearchRequestWithJobTitle = exports.buildSearchRequest = exports.buildContext = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const services_1 = require("../JobsFlow/services");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const context = {
        transaction_id: (_a = input === null || input === void 0 ? void 0 : input.transactionId) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)(),
        domain: `${process.env.DOMAIN}${(_b = input === null || input === void 0 ? void 0 : input.category) !== null && _b !== void 0 ? _b : "courses"}`,
        country: process.env.COUNTRY || ((_c = input === null || input === void 0 ? void 0 : input.country) !== null && _c !== void 0 ? _c : ""),
        city: process.env.CITY || ((_d = input === null || input === void 0 ? void 0 : input.city) !== null && _d !== void 0 ? _d : ""),
        action: (_e = input.action) !== null && _e !== void 0 ? _e : "",
        version: `${process.env.CORE_VERSION || ((_f = input === null || input === void 0 ? void 0 : input.core_version) !== null && _f !== void 0 ? _f : "")}`,
        bap_id: process.env.BAP_ID || ((_g = input === null || input === void 0 ? void 0 : input.bapId) !== null && _g !== void 0 ? _g : ""),
        bap_uri: process.env.BAP_URI || ((_h = input === null || input === void 0 ? void 0 : input.bapUri) !== null && _h !== void 0 ? _h : ""),
        bpp_id: input === null || input === void 0 ? void 0 : input.bppId,
        bpp_uri: input === null || input === void 0 ? void 0 : input.bppUri,
        message_id: (_j = input === null || input === void 0 ? void 0 : input.messageId) !== null && _j !== void 0 ? _j : (0, uuid_1.v4)(),
        timestamp: (_k = input.timestamp) !== null && _k !== void 0 ? _k : (0, moment_1.default)().toISOString()
    };
    return context;
};
exports.buildContext = buildContext;
const buildSearchRequest = (input = {}) => {
    const context = (0, exports.buildContext)({ action: "search", category: "courses" });
    const message = {
        intent: {}
    };
    let item = {};
    let provider = {};
    let category = {};
    const optional = {};
    if (input === null || input === void 0 ? void 0 : input.category) {
        category = {
            descriptor: {
                name: input === null || input === void 0 ? void 0 : input.category
            }
        };
    }
    if (input === null || input === void 0 ? void 0 : input.provider) {
        provider = {
            descriptor: {
                name: input === null || input === void 0 ? void 0 : input.provider
            }
        };
    }
    if ((input === null || input === void 0 ? void 0 : input.deepSearch) && (input === null || input === void 0 ? void 0 : input.deepSearch.length)) {
        item.tags = [];
        item.tags = input === null || input === void 0 ? void 0 : input.deepSearch.map((query) => {
            return {
                display: false,
                name: query === null || query === void 0 ? void 0 : query.searchCriteria,
                list: query === null || query === void 0 ? void 0 : query.searchParameters
            };
        });
    }
    if (input === null || input === void 0 ? void 0 : input.searchTitle) {
        item = Object.assign(Object.assign({}, item), { descriptor: {
                name: input === null || input === void 0 ? void 0 : input.searchTitle
            } });
    }
    if (Object.keys(item).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { item });
    }
    if (Object.keys(provider).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { provider });
    }
    if (Object.keys(category).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { category });
    }
    if (input === null || input === void 0 ? void 0 : input.loggedInUserEmail) {
        optional.user = { "email": input === null || input === void 0 ? void 0 : input.loggedInUserEmail };
    }
    return { payload: { context, message }, optional };
};
exports.buildSearchRequest = buildSearchRequest;
const buildSearchRequestWithJobTitle = (jobSearchInput) => {
    var _a, _b;
    const context = (0, exports.buildContext)({ action: "search", category: "courses" });
    const message = {
        intent: {}
    };
    let item = {};
    let provider = {};
    let category = {};
    const optional = {};
    if ((_a = jobSearchInput === null || jobSearchInput === void 0 ? void 0 : jobSearchInput.title) === null || _a === void 0 ? void 0 : _a.key) {
        // category = {
        //   descriptor: {
        //     name: jobSearchInput?.title?.key
        //   }
        // };
        // provider = {
        //   descriptor: {
        //     name: jobSearchInput?.title?.key
        //   }
        // };
        item = {
            descriptor: {
                name: (_b = jobSearchInput === null || jobSearchInput === void 0 ? void 0 : jobSearchInput.title) === null || _b === void 0 ? void 0 : _b.key
            }
        };
    }
    if (Object.keys(item).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { item });
    }
    if (Object.keys(provider).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { provider });
    }
    if (Object.keys(category).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { category });
    }
    if (jobSearchInput === null || jobSearchInput === void 0 ? void 0 : jobSearchInput.loggedInUserEmail) {
        optional.user = { "email": jobSearchInput === null || jobSearchInput === void 0 ? void 0 : jobSearchInput.loggedInUserEmail };
    }
    return { payload: { context, message }, optional };
};
exports.buildSearchRequestWithJobTitle = buildSearchRequestWithJobTitle;
const buildSearchRequestWithJobRole = (jobRole) => {
    const context = (0, exports.buildContext)({ action: "search", category: "courses" });
    const message = {
        intent: {}
    };
    let item = {};
    let provider = {};
    let category = {};
    const optional = {};
    if (jobRole) {
        // category = {
        //   descriptor: {
        //     name: jobRole
        //   }
        // };
        // provider = {
        //   descriptor: {
        //     name: jobRole
        //   }
        // };
        item = {
            descriptor: {
                name: jobRole
            }
        };
    }
    if (Object.keys(item).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { item });
    }
    if (Object.keys(provider).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { provider });
    }
    if (Object.keys(category).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { category });
    }
    return { payload: { context, message }, optional };
};
exports.buildSearchRequestWithJobRole = buildSearchRequestWithJobRole;
const buildSearchRequestWithJobSkill = (skill) => {
    var _a, _b;
    const context = (0, exports.buildContext)({ action: "search", category: "courses" });
    const message = {
        intent: {}
    };
    let item = {};
    let provider = {};
    let category = {};
    const optional = {};
    if ((_a = skill === null || skill === void 0 ? void 0 : skill.code) !== null && _a !== void 0 ? _a : skill === null || skill === void 0 ? void 0 : skill.name) {
        // category = {
        //   descriptor: {
        //     name: skill?.code ?? skill?.name
        //   }
        // };
        // provider = {
        //   descriptor: {
        //     name: skill?.code ?? skill?.name
        //   }
        // };
        item = {
            descriptor: {
                name: (_b = skill === null || skill === void 0 ? void 0 : skill.code) !== null && _b !== void 0 ? _b : skill === null || skill === void 0 ? void 0 : skill.name
            }
        };
    }
    if (Object.keys(item).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { item });
    }
    if (Object.keys(provider).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { provider });
    }
    if (Object.keys(category).length) {
        message.intent = Object.assign(Object.assign({}, message.intent), { category });
    }
    return { payload: { context, message }, optional };
};
exports.buildSearchRequestWithJobSkill = buildSearchRequestWithJobSkill;
const buildOnSearchMergedResponse = (response = {}, body = {}, isJobSearchQuery = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    let savedAppliedResult = (response === null || response === void 0 ? void 0 : response.itemRes) ? yield (0, exports.buildSavedAppliedCategoryResponse)(response.itemRes[0], response.itemRes[1]) : null;
    return (0, exports.buildSearchResponse)(response.searchRes, body, (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.itemRes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.courses, (_f = (_e = (_d = response === null || response === void 0 ? void 0 : response.itemRes) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.courses, isJobSearchQuery);
});
exports.buildOnSearchMergedResponse = buildOnSearchMergedResponse;
const buildSearchResponse = (response = {}, body = {}, savedItems = [], appliedItems = [], isJobSearchQuery = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l;
    const input = (_h = (_g = response === null || response === void 0 ? void 0 : response.data) === null || _g === void 0 ? void 0 : _g.responses) === null || _h === void 0 ? void 0 : _h[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_j = input === null || input === void 0 ? void 0 : input.context) !== null && _j !== void 0 ? _j : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const courses = [];
    const providers = (_l = (_k = input === null || input === void 0 ? void 0 : input.message) === null || _k === void 0 ? void 0 : _k.catalog) === null || _l === void 0 ? void 0 : _l.providers;
    providers === null || providers === void 0 ? void 0 : providers.forEach((provider) => {
        provider === null || provider === void 0 ? void 0 : provider.items.forEach((item) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const categoryFound = provider === null || provider === void 0 ? void 0 : provider.categories.find((category) => (category === null || category === void 0 ? void 0 : category.id) === item.category_id);
            courses.push({
                id: item === null || item === void 0 ? void 0 : item.id,
                name: (_a = item === null || item === void 0 ? void 0 : item.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                description: (_b = item === null || item === void 0 ? void 0 : item.descriptor) === null || _b === void 0 ? void 0 : _b.long_desc,
                userSavedItem: !!(savedItems === null || savedItems === void 0 ? void 0 : savedItems.find((savedItem) => (savedItem === null || savedItem === void 0 ? void 0 : savedItem.course_id) == (item === null || item === void 0 ? void 0 : item.id))),
                userAppliedItem: !!(appliedItems === null || appliedItems === void 0 ? void 0 : appliedItems.find((appliedItem) => (appliedItem === null || appliedItem === void 0 ? void 0 : appliedItem.course_id) == (item === null || item === void 0 ? void 0 : item.id))),
                imageLocations: (_c = item === null || item === void 0 ? void 0 : item.descriptor) === null || _c === void 0 ? void 0 : _c.images.map((img) => (img === null || img === void 0 ? void 0 : img.url) || ""),
                duration: (_d = item === null || item === void 0 ? void 0 : item.time) === null || _d === void 0 ? void 0 : _d.duration,
                provider: {
                    id: provider === null || provider === void 0 ? void 0 : provider.id,
                    name: (_e = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _e === void 0 ? void 0 : _e.name,
                    description: (_f = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _f === void 0 ? void 0 : _f.name
                },
                category: {
                    id: categoryFound ? categoryFound === null || categoryFound === void 0 ? void 0 : categoryFound.id : "",
                    name: categoryFound ? (_g = categoryFound === null || categoryFound === void 0 ? void 0 : categoryFound.descriptor) === null || _g === void 0 ? void 0 : _g.name : ""
                }
            });
        });
    });
    const enrichedCourses = isJobSearchQuery ? courses : yield enrichCoursesWithRelevantJobs(courses);
    // console.log("non enriched courses : ", courses);
    console.log("enriched course : ", enrichedCourses);
    return { data: { context, courses: enrichedCourses } };
});
exports.buildSearchResponse = buildSearchResponse;
function enrichCoursesWithRelevantJobs(courses) {
    return __awaiter(this, void 0, void 0, function* () {
        const enrichedCourses = [];
        for (let course of courses) {
            let jobsForCourse = yield Promise.all([
                (0, services_1.searchJobWithCourseName)(course),
                (0, services_1.searchJobWithCourseProvider)(course),
                (0, services_1.searchJobWithCourseCategory)(course)
            ]).then((res => res)).catch(error => null);
            enrichedCourses.push(Object.assign(Object.assign({}, course), { myOutput: jobsForCourse }));
        }
        // const enrichedCourses = await Promise.all(
        //   courses.map((course: any) => {
        //     return searchJobWithCourseName(course)
        //   })
        //   // searchJobWithCourseName(courses[0])
        // ).then(res => {
        //   console.log("value of res = ", res);
        //   let temp:any[]=[];
        //   let i=0;
        //   courses.forEach((course: any) => {
        //     temp.push({
        //       ...course,
        //       myOutput: res[i]
        //     })
        //     i=i+1;
        //   })
        //   return temp;
        // }).catch(error =>null);
        console.log("These are enriched courses - > ", enrichedCourses);
        return enrichedCourses;
    });
}
exports.enrichCoursesWithRelevantJobs = enrichCoursesWithRelevantJobs;
const buildSavedAppliedCategoryResponse = (savedResponse = {}, appliedResponse = {}) => {
    var _a, _b;
    const savedInput = (_a = savedResponse === null || savedResponse === void 0 ? void 0 : savedResponse.data) === null || _a === void 0 ? void 0 : _a.courses;
    const appliedInput = (_b = appliedResponse === null || appliedResponse === void 0 ? void 0 : appliedResponse.data) === null || _b === void 0 ? void 0 : _b.courses;
    const mentorMap = {
        saved: {}, applied: {}
    };
    if (savedResponse === null || savedResponse === void 0 ? void 0 : savedResponse.data) {
        savedInput.forEach(({ course_id }) => {
            mentorMap['saved'][course_id] = true;
        });
    }
    if (appliedResponse === null || appliedResponse === void 0 ? void 0 : appliedResponse.data) {
        appliedInput.forEach(({ course_id }) => {
            mentorMap['applied'][course_id] = true;
        });
    }
    return mentorMap;
};
exports.buildSavedAppliedCategoryResponse = buildSavedAppliedCategoryResponse;
const buildInitRequest = (input = {}) => {
    var _a, _b, _c, _d, _e, _f;
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { category: "courses", action: "init" }));
    const message = { order: { items: [{ id: input === null || input === void 0 ? void 0 : input.courseId }] } };
    if ((_a = input === null || input === void 0 ? void 0 : input.applicantProfile) === null || _a === void 0 ? void 0 : _a.name) {
        message.order.fulfillments = [{ customer: { person: { name: (_b = input === null || input === void 0 ? void 0 : input.applicantProfile) === null || _b === void 0 ? void 0 : _b.name } } }];
    }
    if (input === null || input === void 0 ? void 0 : input.additionalFormData) {
        message.order.xinput = {
            submission_id: (_c = input === null || input === void 0 ? void 0 : input.additionalFormData) === null || _c === void 0 ? void 0 : _c.submissionId,
            data: Object.fromEntries((_f = (_e = (_d = input === null || input === void 0 ? void 0 : input.additionalFormData) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.map((formData) => [formData === null || formData === void 0 ? void 0 : formData.formInputKey, formData === null || formData === void 0 ? void 0 : formData.formInputValue])) !== null && _f !== void 0 ? _f : [])
        };
    }
    return { payload: { context, message } };
};
exports.buildInitRequest = buildInitRequest;
const buildInitResponse = (response = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_e = (_d = input === null || input === void 0 ? void 0 : input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const item = (_h = (_g = (_f = input === null || input === void 0 ? void 0 : input.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.items) === null || _h === void 0 ? void 0 : _h[0];
    const category = (_j = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _j === void 0 ? void 0 : _j.find((category) => (category === null || category === void 0 ? void 0 : category.id) === (item === null || item === void 0 ? void 0 : item.category_id));
    const course = {
        id: item === null || item === void 0 ? void 0 : item.id,
        name: (_k = item === null || item === void 0 ? void 0 : item.descriptor) === null || _k === void 0 ? void 0 : _k.name,
        description: (_l = item === null || item === void 0 ? void 0 : item.descriptor) === null || _l === void 0 ? void 0 : _l.long_desc,
        imageLocations: (_o = (_m = item === null || item === void 0 ? void 0 : item.descriptor) === null || _m === void 0 ? void 0 : _m.images) === null || _o === void 0 ? void 0 : _o.map((image) => image === null || image === void 0 ? void 0 : image.url),
        duration: (_p = item === null || item === void 0 ? void 0 : item.time) === null || _p === void 0 ? void 0 : _p.duration,
        provider: {
            id: provider === null || provider === void 0 ? void 0 : provider.id,
            name: (_q = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _q === void 0 ? void 0 : _q.name,
            description: (_r = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _r === void 0 ? void 0 : _r.long_desc
        },
        category: {
            id: category === null || category === void 0 ? void 0 : category.id,
            name: category === null || category === void 0 ? void 0 : category.name
        }
    };
    let courseDetails = (_s = item === null || item === void 0 ? void 0 : item.tags) === null || _s === void 0 ? void 0 : _s.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "courseDetails"; });
    const eligibility = (_t = item === null || item === void 0 ? void 0 : item.tags) === null || _t === void 0 ? void 0 : _t.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "eligibility"; });
    const courseHighlights = (_u = item === null || item === void 0 ? void 0 : item.tags) === null || _u === void 0 ? void 0 : _u.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "courseHighlights"; });
    const prerequisites = (_v = item === null || item === void 0 ? void 0 : item.tags) === null || _v === void 0 ? void 0 : _v.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "prerequisites"; });
    const additionalFormUrl = (_x = (_w = item === null || item === void 0 ? void 0 : item.xinput) === null || _w === void 0 ? void 0 : _w.form) === null || _x === void 0 ? void 0 : _x.url;
    courseDetails = {
        price: (_z = (_y = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _y === void 0 ? void 0 : _y.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "price"; })) === null || _z === void 0 ? void 0 : _z.value,
        startDate: (_1 = (_0 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _0 === void 0 ? void 0 : _0.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "startDate"; })) === null || _1 === void 0 ? void 0 : _1.value,
        endDate: (_3 = (_2 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _2 === void 0 ? void 0 : _2.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "endDate"; })) === null || _3 === void 0 ? void 0 : _3.value,
        rating: (_5 = (_4 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _4 === void 0 ? void 0 : _4.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "rating"; })) === null || _5 === void 0 ? void 0 : _5.value,
        credits: (_7 = (_6 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _6 === void 0 ? void 0 : _6.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "credits"; })) === null || _7 === void 0 ? void 0 : _7.value,
        instructors: (_9 = (_8 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _8 === void 0 ? void 0 : _8.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "instructors"; })) === null || _9 === void 0 ? void 0 : _9.value,
        offeringInstitue: (_11 = (_10 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _10 === void 0 ? void 0 : _10.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "offeringInstitue"; })) === null || _11 === void 0 ? void 0 : _11.value,
        courseUrl: (_13 = (_12 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _12 === void 0 ? void 0 : _12.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "url"; })) === null || _13 === void 0 ? void 0 : _13.value,
        enrollmentEndDate: (_15 = (_14 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _14 === void 0 ? void 0 : _14.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "enrollmentEndDate"; })) === null || _15 === void 0 ? void 0 : _15.value,
        eligibility: (_16 = eligibility === null || eligibility === void 0 ? void 0 : eligibility.list) === null || _16 === void 0 ? void 0 : _16.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        courseHighlights: (_17 = courseHighlights === null || courseHighlights === void 0 ? void 0 : courseHighlights.list) === null || _17 === void 0 ? void 0 : _17.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        prerequisites: (_18 = prerequisites === null || prerequisites === void 0 ? void 0 : prerequisites.list) === null || _18 === void 0 ? void 0 : _18.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); })
    };
    const fulfillment = (_21 = (_20 = (_19 = input === null || input === void 0 ? void 0 : input.message) === null || _19 === void 0 ? void 0 : _19.order) === null || _20 === void 0 ? void 0 : _20.fulfillments) === null || _21 === void 0 ? void 0 : _21[0];
    const applicantProfile = {
        name: (_23 = (_22 = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.customer) === null || _22 === void 0 ? void 0 : _22.person) === null || _23 === void 0 ? void 0 : _23.name,
        email: (_24 = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _24 === void 0 ? void 0 : _24.email,
        contact: (_25 = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _25 === void 0 ? void 0 : _25.phone,
    };
    const additionalFormData = {
        formUrl: (_27 = (_26 = item === null || item === void 0 ? void 0 : item.xinput) === null || _26 === void 0 ? void 0 : _26.form) === null || _27 === void 0 ? void 0 : _27.url,
        formMimeType: (_29 = (_28 = item === null || item === void 0 ? void 0 : item.xinput) === null || _28 === void 0 ? void 0 : _28.form) === null || _29 === void 0 ? void 0 : _29.mime_type,
        submissionId: (_31 = (_30 = item === null || item === void 0 ? void 0 : item.xinput) === null || _30 === void 0 ? void 0 : _30.form) === null || _31 === void 0 ? void 0 : _31.submission_id,
        data: Object.keys((_34 = (_33 = (_32 = item === null || item === void 0 ? void 0 : item.xinput) === null || _32 === void 0 ? void 0 : _32.form) === null || _33 === void 0 ? void 0 : _33.data) !== null && _34 !== void 0 ? _34 : {}).map((key) => { var _a, _b; return { formInputKey: key, formInputValue: (_b = (_a = item === null || item === void 0 ? void 0 : item.xinput) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.data[key] }; })
    };
    return { data: { context, course, courseDetails, applicantProfile, additionalFormUrl, additionalFormData } };
};
exports.buildInitResponse = buildInitResponse;
const buildConfirmRequest = (input = {}) => {
    var _a, _b;
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { category: "courses", action: "confirm" }));
    const message = { order: { items: [{ id: input === null || input === void 0 ? void 0 : input.courseId }] } };
    if ((_a = input === null || input === void 0 ? void 0 : input.applicantProfile) === null || _a === void 0 ? void 0 : _a.name) {
        message.order.fulfillments = [{ customer: { person: { name: (_b = input === null || input === void 0 ? void 0 : input.applicantProfile) === null || _b === void 0 ? void 0 : _b.name } } }];
    }
    return { payload: { context, message } };
};
exports.buildConfirmRequest = buildConfirmRequest;
const buildConfirmResponse = (response = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_e = (_d = input === null || input === void 0 ? void 0 : input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const item = (_h = (_g = (_f = input === null || input === void 0 ? void 0 : input.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.items) === null || _h === void 0 ? void 0 : _h[0];
    const category = (_j = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _j === void 0 ? void 0 : _j.find((category) => (category === null || category === void 0 ? void 0 : category.id) === (item === null || item === void 0 ? void 0 : item.category_id));
    const course = {
        id: item === null || item === void 0 ? void 0 : item.id,
        name: (_k = item === null || item === void 0 ? void 0 : item.descriptor) === null || _k === void 0 ? void 0 : _k.name,
        description: (_l = item === null || item === void 0 ? void 0 : item.descriptor) === null || _l === void 0 ? void 0 : _l.long_desc,
        imageLocations: (_o = (_m = item === null || item === void 0 ? void 0 : item.descriptor) === null || _m === void 0 ? void 0 : _m.images) === null || _o === void 0 ? void 0 : _o.map((image) => image === null || image === void 0 ? void 0 : image.url),
        duration: (_p = item === null || item === void 0 ? void 0 : item.time) === null || _p === void 0 ? void 0 : _p.duration,
        provider: {
            id: provider === null || provider === void 0 ? void 0 : provider.id,
            name: (_q = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _q === void 0 ? void 0 : _q.name,
            description: (_r = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _r === void 0 ? void 0 : _r.long_desc
        },
        category: {
            id: category === null || category === void 0 ? void 0 : category.id,
            name: category === null || category === void 0 ? void 0 : category.name
        }
    };
    const applicationId = (_t = (_s = input === null || input === void 0 ? void 0 : input.message) === null || _s === void 0 ? void 0 : _s.order) === null || _t === void 0 ? void 0 : _t.id;
    const applicationState = (_v = (_u = input === null || input === void 0 ? void 0 : input.message) === null || _u === void 0 ? void 0 : _u.order) === null || _v === void 0 ? void 0 : _v.state;
    let courseDetails = (_w = item === null || item === void 0 ? void 0 : item.tags) === null || _w === void 0 ? void 0 : _w.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "courseDetails"; });
    const eligibility = (_x = item === null || item === void 0 ? void 0 : item.tags) === null || _x === void 0 ? void 0 : _x.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "eligibility"; });
    const courseHighlights = (_y = item === null || item === void 0 ? void 0 : item.tags) === null || _y === void 0 ? void 0 : _y.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "courseHighlights"; });
    const prerequisites = (_z = item === null || item === void 0 ? void 0 : item.tags) === null || _z === void 0 ? void 0 : _z.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "prerequisites"; });
    const additionalFormUrl = (_1 = (_0 = item === null || item === void 0 ? void 0 : item.xinput) === null || _0 === void 0 ? void 0 : _0.form) === null || _1 === void 0 ? void 0 : _1.url;
    courseDetails = {
        price: (_3 = (_2 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _2 === void 0 ? void 0 : _2.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "price"; })) === null || _3 === void 0 ? void 0 : _3.value,
        startDate: (_5 = (_4 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _4 === void 0 ? void 0 : _4.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "startDate"; })) === null || _5 === void 0 ? void 0 : _5.value,
        endDate: (_7 = (_6 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _6 === void 0 ? void 0 : _6.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "endDate"; })) === null || _7 === void 0 ? void 0 : _7.value,
        rating: (_9 = (_8 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _8 === void 0 ? void 0 : _8.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "rating"; })) === null || _9 === void 0 ? void 0 : _9.value,
        credits: (_11 = (_10 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _10 === void 0 ? void 0 : _10.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "credits"; })) === null || _11 === void 0 ? void 0 : _11.value,
        instructors: (_13 = (_12 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _12 === void 0 ? void 0 : _12.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "instructors"; })) === null || _13 === void 0 ? void 0 : _13.value,
        offeringInstitue: (_15 = (_14 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _14 === void 0 ? void 0 : _14.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "offeringInstitue"; })) === null || _15 === void 0 ? void 0 : _15.value,
        courseUrl: (_17 = (_16 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _16 === void 0 ? void 0 : _16.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "url"; })) === null || _17 === void 0 ? void 0 : _17.value,
        enrollmentEndDate: (_19 = (_18 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _18 === void 0 ? void 0 : _18.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "enrollmentEndDate"; })) === null || _19 === void 0 ? void 0 : _19.value,
        eligibility: (_20 = eligibility === null || eligibility === void 0 ? void 0 : eligibility.list) === null || _20 === void 0 ? void 0 : _20.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        courseHighlights: (_21 = courseHighlights === null || courseHighlights === void 0 ? void 0 : courseHighlights.list) === null || _21 === void 0 ? void 0 : _21.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        prerequisites: (_22 = prerequisites === null || prerequisites === void 0 ? void 0 : prerequisites.list) === null || _22 === void 0 ? void 0 : _22.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); })
    };
    const fulfillment = (_25 = (_24 = (_23 = input === null || input === void 0 ? void 0 : input.message) === null || _23 === void 0 ? void 0 : _23.order) === null || _24 === void 0 ? void 0 : _24.fulfillments) === null || _25 === void 0 ? void 0 : _25[0];
    const applicantProfile = {
        name: (_27 = (_26 = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.customer) === null || _26 === void 0 ? void 0 : _26.person) === null || _27 === void 0 ? void 0 : _27.name,
        email: (_28 = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _28 === void 0 ? void 0 : _28.email,
        contact: (_29 = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.contact) === null || _29 === void 0 ? void 0 : _29.phone,
    };
    const additionalFormData = {
        formUrl: (_31 = (_30 = item === null || item === void 0 ? void 0 : item.xinput) === null || _30 === void 0 ? void 0 : _30.form) === null || _31 === void 0 ? void 0 : _31.url,
        formMimeType: (_33 = (_32 = item === null || item === void 0 ? void 0 : item.xinput) === null || _32 === void 0 ? void 0 : _32.form) === null || _33 === void 0 ? void 0 : _33.mime_type,
        submissionId: (_35 = (_34 = item === null || item === void 0 ? void 0 : item.xinput) === null || _34 === void 0 ? void 0 : _34.form) === null || _35 === void 0 ? void 0 : _35.submission_id,
        data: Object.keys((_38 = (_37 = (_36 = item === null || item === void 0 ? void 0 : item.xinput) === null || _36 === void 0 ? void 0 : _36.form) === null || _37 === void 0 ? void 0 : _37.data) !== null && _38 !== void 0 ? _38 : {}).map((key) => { var _a, _b; return { formInputKey: key, formInputValue: (_b = (_a = item === null || item === void 0 ? void 0 : item.xinput) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.data[key] }; })
    };
    return { data: { context, applicationId, applicationState, course, courseDetails, applicantProfile, additionalFormUrl, additionalFormData } };
};
exports.buildConfirmResponse = buildConfirmResponse;
const buildStatusRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { category: "courses", action: "confirm" }));
    const message = {};
    return { payload: { context, message } };
};
exports.buildStatusRequest = buildStatusRequest;
const buildStatusResponse = (response = {}, input = {}) => {
    var _a, _b, _c;
    const context = {
        transactionId: (_a = response === null || response === void 0 ? void 0 : response.context) === null || _a === void 0 ? void 0 : _a.message_id,
        bppId: (_b = response === null || response === void 0 ? void 0 : response.context) === null || _b === void 0 ? void 0 : _b.bpp_id,
        bppUri: (_c = response === null || response === void 0 ? void 0 : response.context) === null || _c === void 0 ? void 0 : _c.bpp_uri
    };
    return { context };
};
exports.buildStatusResponse = buildStatusResponse;
const buildSelectRequest = (input = {}) => {
    const context = (0, exports.buildContext)(Object.assign(Object.assign({}, input === null || input === void 0 ? void 0 : input.context), { category: "courses", action: "select" }));
    const message = {
        order: { items: [{ id: input === null || input === void 0 ? void 0 : input.courseId }] }
    };
    return { payload: { context, message } };
};
exports.buildSelectRequest = buildSelectRequest;
const buildSelectResponse = (response = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_e = (_d = input === null || input === void 0 ? void 0 : input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const item = (_h = (_g = (_f = input === null || input === void 0 ? void 0 : input.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.items) === null || _h === void 0 ? void 0 : _h[0];
    const category = (_j = provider === null || provider === void 0 ? void 0 : provider.categories) === null || _j === void 0 ? void 0 : _j.find((category) => (category === null || category === void 0 ? void 0 : category.id) === (item === null || item === void 0 ? void 0 : item.category_id));
    const course = {
        id: item === null || item === void 0 ? void 0 : item.id,
        name: (_k = item === null || item === void 0 ? void 0 : item.descriptor) === null || _k === void 0 ? void 0 : _k.name,
        description: (_l = item === null || item === void 0 ? void 0 : item.descriptor) === null || _l === void 0 ? void 0 : _l.long_desc,
        imageLocations: (_o = (_m = item === null || item === void 0 ? void 0 : item.descriptor) === null || _m === void 0 ? void 0 : _m.images) === null || _o === void 0 ? void 0 : _o.map((image) => image === null || image === void 0 ? void 0 : image.url),
        duration: (_p = item === null || item === void 0 ? void 0 : item.time) === null || _p === void 0 ? void 0 : _p.duration,
        provider: {
            id: provider === null || provider === void 0 ? void 0 : provider.id,
            name: (_q = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _q === void 0 ? void 0 : _q.name,
            description: (_r = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _r === void 0 ? void 0 : _r.long_desc
        },
        category: {
            id: category === null || category === void 0 ? void 0 : category.id,
            name: category === null || category === void 0 ? void 0 : category.name
        }
    };
    let courseDetails = (_s = item === null || item === void 0 ? void 0 : item.tags) === null || _s === void 0 ? void 0 : _s.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "courseDetails"; });
    const eligibility = (_t = item === null || item === void 0 ? void 0 : item.tags) === null || _t === void 0 ? void 0 : _t.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "eligibility"; });
    const courseHighlights = (_u = item === null || item === void 0 ? void 0 : item.tags) === null || _u === void 0 ? void 0 : _u.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "courseHighlights"; });
    const prerequisites = (_v = item === null || item === void 0 ? void 0 : item.tags) === null || _v === void 0 ? void 0 : _v.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "prerequisites"; });
    const additionalFormUrl = (_x = (_w = item === null || item === void 0 ? void 0 : item.xinput) === null || _w === void 0 ? void 0 : _w.form) === null || _x === void 0 ? void 0 : _x.url;
    courseDetails = {
        price: (_z = (_y = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _y === void 0 ? void 0 : _y.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "price"; })) === null || _z === void 0 ? void 0 : _z.value,
        startDate: (_1 = (_0 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _0 === void 0 ? void 0 : _0.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "startDate"; })) === null || _1 === void 0 ? void 0 : _1.value,
        endDate: (_3 = (_2 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _2 === void 0 ? void 0 : _2.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "endDate"; })) === null || _3 === void 0 ? void 0 : _3.value,
        rating: (_5 = (_4 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _4 === void 0 ? void 0 : _4.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "rating"; })) === null || _5 === void 0 ? void 0 : _5.value,
        credits: (_7 = (_6 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _6 === void 0 ? void 0 : _6.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "credits"; })) === null || _7 === void 0 ? void 0 : _7.value,
        instructors: (_9 = (_8 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _8 === void 0 ? void 0 : _8.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "instructors"; })) === null || _9 === void 0 ? void 0 : _9.value,
        offeringInstitue: (_11 = (_10 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _10 === void 0 ? void 0 : _10.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "offeringInstitue"; })) === null || _11 === void 0 ? void 0 : _11.value,
        courseUrl: (_13 = (_12 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _12 === void 0 ? void 0 : _12.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "url"; })) === null || _13 === void 0 ? void 0 : _13.value,
        enrollmentEndDate: (_15 = (_14 = courseDetails === null || courseDetails === void 0 ? void 0 : courseDetails.list) === null || _14 === void 0 ? void 0 : _14.find((detail) => { var _a; return ((_a = detail === null || detail === void 0 ? void 0 : detail.descriptor) === null || _a === void 0 ? void 0 : _a.name) == "enrollmentEndDate"; })) === null || _15 === void 0 ? void 0 : _15.value,
        eligibility: (_16 = eligibility === null || eligibility === void 0 ? void 0 : eligibility.list) === null || _16 === void 0 ? void 0 : _16.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        courseHighlights: (_17 = courseHighlights === null || courseHighlights === void 0 ? void 0 : courseHighlights.list) === null || _17 === void 0 ? void 0 : _17.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        prerequisites: (_18 = prerequisites === null || prerequisites === void 0 ? void 0 : prerequisites.list) === null || _18 === void 0 ? void 0 : _18.map((li) => { var _a; return ({ name: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.name, value: li === null || li === void 0 ? void 0 : li.value }); })
    };
    return { data: { context, course, courseDetails, additionalFormUrl } };
};
exports.buildSelectResponse = buildSelectResponse;

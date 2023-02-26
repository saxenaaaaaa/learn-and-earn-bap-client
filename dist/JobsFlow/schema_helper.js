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
exports.buildOnStatusResponse = exports.buildOnStatusRequest = exports.buildStatusResponse = exports.buildStatusRequest = exports.buildError = exports.buildOnConfirmResponse = exports.buildOnConfirmRequest = exports.buildConfirmResponse = exports.buildConfirmRequest = exports.buildOnInitResponse = exports.buildOnInitRequest = exports.buildInitResponse = exports.buildInitRequest = exports.buildOnSelectResponse = exports.buildOnSelectRequest = exports.buildSelectResponse = exports.buildSelectRequest = exports.buildSavedAppliedJobResonse = exports.enrichJobResultsWithCourseData = exports.buildOnSearchResponse = exports.buildOnSearchMergedResponse = exports.buildOnSearchRequest = exports.buildSearchResponse = exports.buildSearchRequest = exports.buildSearchRequestForJobWithCourseProvider = exports.buildSearchRequestForJobWithCourseCategory = exports.buildSearchRequestForJobWithCourseName = exports.isAcknowledged = exports.buildContext = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const services_1 = require("../TrainingAndCourses/services");
const buildContext = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        domain: process.env.DOMAIN + (input === null || input === void 0 ? void 0 : input.category),
        action: (_a = input === null || input === void 0 ? void 0 : input.action) !== null && _a !== void 0 ? _a : "",
        // location: { city: { code: process.env.CITY || (input?.city ?? "") }, country: { code: process.env.COUNTRY || (input?.country ?? "") } },
        version: process.env.CORE_VERSION || ((_b = input === null || input === void 0 ? void 0 : input.core_version) !== null && _b !== void 0 ? _b : ""),
        bap_id: (_c = process.env.BAP_ID) !== null && _c !== void 0 ? _c : input === null || input === void 0 ? void 0 : input.bapId,
        bap_uri: (_d = process.env.BAP_URI) !== null && _d !== void 0 ? _d : input === null || input === void 0 ? void 0 : input.bapUri,
        bpp_id: input === null || input === void 0 ? void 0 : input.bppId,
        bpp_uri: input === null || input === void 0 ? void 0 : input.bppUri,
        transaction_id: (_e = input === null || input === void 0 ? void 0 : input.transactionId) !== null && _e !== void 0 ? _e : (0, uuid_1.v4)(),
        message_id: (_f = input === null || input === void 0 ? void 0 : input.messageId) !== null && _f !== void 0 ? _f : (0, uuid_1.v4)(),
        timestamp: (_g = input.timestamp) !== null && _g !== void 0 ? _g : (0, moment_1.default)().toISOString(),
        ttl: "P1M",
    };
};
exports.buildContext = buildContext;
const isAcknowledged = (input = {}) => {
    var _a, _b;
    return (((_b = (_a = input === null || input === void 0 ? void 0 : input.message) === null || _a === void 0 ? void 0 : _a.ack) === null || _b === void 0 ? void 0 : _b.status) === "ACK");
};
exports.isAcknowledged = isAcknowledged;
const buildSearchRequestForJobWithCourseName = (course) => {
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'search' });
    const intent = {};
    const optional = {};
    intent.item = { "descriptor": { "name": course.name } };
    intent.fulfillment = { customer: { person: { skills: [{ code: course.name }] } } };
    const message = { intent: intent };
    return { payload: { context, message }, optional };
};
exports.buildSearchRequestForJobWithCourseName = buildSearchRequestForJobWithCourseName;
const buildSearchRequestForJobWithCourseCategory = (course) => {
    var _a, _b, _c;
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'search' });
    const intent = {};
    const optional = {};
    if ((_a = course.category) === null || _a === void 0 ? void 0 : _a.name) {
        intent.item = { "descriptor": { "name": (_b = course.category) === null || _b === void 0 ? void 0 : _b.name } };
        intent.fulfillment = { customer: { person: { skills: [{ code: (_c = course.category) === null || _c === void 0 ? void 0 : _c.name }] } } };
    }
    const message = { intent: intent };
    return { payload: { context, message }, optional };
};
exports.buildSearchRequestForJobWithCourseCategory = buildSearchRequestForJobWithCourseCategory;
const buildSearchRequestForJobWithCourseProvider = (course) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'search' });
    const intent = {};
    const optional = {};
    if ((_b = (_a = course.provider) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : (_c = course.provider) === null || _c === void 0 ? void 0 : _c.name) {
        intent.item = { "descriptor": { "name": (_e = (_d = course.provider) === null || _d === void 0 ? void 0 : _d.description) !== null && _e !== void 0 ? _e : (_f = course.provider) === null || _f === void 0 ? void 0 : _f.name } };
        intent.fulfillment = { customer: { person: { skills: [{ code: (_h = (_g = course.provider) === null || _g === void 0 ? void 0 : _g.description) !== null && _h !== void 0 ? _h : (_j = course.provider) === null || _j === void 0 ? void 0 : _j.name }] } } };
    }
    const message = { intent: intent };
    return { payload: { context, message }, optional };
};
exports.buildSearchRequestForJobWithCourseProvider = buildSearchRequestForJobWithCourseProvider;
const buildSearchRequest = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'search' });
    const intent = {};
    const optional = {};
    if ((_a = input === null || input === void 0 ? void 0 : input.title) === null || _a === void 0 ? void 0 : _a.key) {
        intent.item = { "descriptor": { "name": (_b = input === null || input === void 0 ? void 0 : input.title) === null || _b === void 0 ? void 0 : _b.key } };
    }
    if ((_c = input === null || input === void 0 ? void 0 : input.company) === null || _c === void 0 ? void 0 : _c.name) {
        intent.provider = { "descriptor": { "name": (_d = input === null || input === void 0 ? void 0 : input.company) === null || _d === void 0 ? void 0 : _d.name } };
    }
    if ((_e = input === null || input === void 0 ? void 0 : input.company) === null || _e === void 0 ? void 0 : _e.locations) {
        intent.provider = Object.assign(Object.assign({}, ((_f = intent === null || intent === void 0 ? void 0 : intent.provider) !== null && _f !== void 0 ? _f : {})), { locations: (_h = (_g = input === null || input === void 0 ? void 0 : input.company) === null || _g === void 0 ? void 0 : _g.locations) === null || _h === void 0 ? void 0 : _h.map((name) => {
                return { city: { name: name.city } };
            }) });
    }
    if (input === null || input === void 0 ? void 0 : input.loggedInUserEmail) {
        optional.user = { "email": input === null || input === void 0 ? void 0 : input.loggedInUserEmail };
    }
    if ((_j = input === null || input === void 0 ? void 0 : input.skills) === null || _j === void 0 ? void 0 : _j.length) {
        intent.fulfillment = { customer: { person: { skills: input === null || input === void 0 ? void 0 : input.skills } } };
    }
    const message = { intent: intent };
    return { payload: { context, message }, optional };
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
const buildOnSearchMergedResponse = (response = {}, body = {}, isCourseSearchQuery = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    return (0, exports.buildOnSearchResponse)(response.searchRes, body, (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.itemRes) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.jobs, (_f = (_e = (_d = response === null || response === void 0 ? void 0 : response.itemRes) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.jobs, isCourseSearchQuery);
});
exports.buildOnSearchMergedResponse = buildOnSearchMergedResponse;
const buildOnSearchResponse = (response = {}, body = {}, savedItems = [], appliedItems = [], isCourseSearchQuery = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m, _o, _p;
    const input = (_h = (_g = response === null || response === void 0 ? void 0 : response.data) === null || _g === void 0 ? void 0 : _g.responses) === null || _h === void 0 ? void 0 : _h[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_j = input === null || input === void 0 ? void 0 : input.context) !== null && _j !== void 0 ? _j : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const providers = (_l = (_k = input === null || input === void 0 ? void 0 : input.message) === null || _k === void 0 ? void 0 : _k.catalog) === null || _l === void 0 ? void 0 : _l.providers;
    const jobProviderPlatform = (_p = (_o = (_m = input === null || input === void 0 ? void 0 : input.message) === null || _m === void 0 ? void 0 : _m.catalog) === null || _o === void 0 ? void 0 : _o.descriptor) === null || _p === void 0 ? void 0 : _p.name;
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
                    userSavedItem: !!(savedItems === null || savedItems === void 0 ? void 0 : savedItems.find((savedItem) => (savedItem === null || savedItem === void 0 ? void 0 : savedItem.job_id) == (item === null || item === void 0 ? void 0 : item.id))),
                    userAppliedItem: !!(appliedItems === null || appliedItems === void 0 ? void 0 : appliedItems.find((appliedItem) => (appliedItem === null || appliedItem === void 0 ? void 0 : appliedItem.job_id) == (item === null || item === void 0 ? void 0 : item.id))),
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
    console.log("JobResults returned are : ", JSON.stringify(jobResults));
    const enrichedJobResults = (isCourseSearchQuery ? jobResults : yield enrichJobResultsWithCourseData([jobResults[0]], body));
    console.log("Enriched job results : ", JSON.stringify(enrichedJobResults));
    return { data: { context, jobProviderPlatform, enrichedJobResults } };
});
exports.buildOnSearchResponse = buildOnSearchResponse;
function enrichJobResultsWithCourseData(jobResults, jobSearchInput = {}) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let coursesWithSkills = {};
        let coursesWithTitle = {};
        if ((_a = jobSearchInput === null || jobSearchInput === void 0 ? void 0 : jobSearchInput.skills) === null || _a === void 0 ? void 0 : _a.length) {
            for (let skill of jobSearchInput === null || jobSearchInput === void 0 ? void 0 : jobSearchInput.skills) {
                console.log("Called for skills.");
                let coursesWithSkill = yield (0, services_1.searchCoursesWithJobSkill)({ skill: skill });
                coursesWithSkills[skill.code] = coursesWithSkill;
            }
        }
        if ((_b = jobSearchInput === null || jobSearchInput === void 0 ? void 0 : jobSearchInput.title) === null || _b === void 0 ? void 0 : _b.key) {
            console.log("called for jobtitle");
            coursesWithTitle = yield (0, services_1.searchCoursesWithJobTitle)(jobSearchInput);
        }
        const enrichedJobResults = [];
        for (let jobResult of jobResults) {
            let enrichedJobs = [];
            let enrichedJobResult;
            // console.log("Job Result : ", JSON.stringify(jobResult));
            for (let job of jobResult.jobs) {
                // console.log("Job is : ", JSON.stringify(job));
                let enrichedJob = {};
                let coursesWithRoles = [];
                if (job.role) {
                    const roles = job.role.split(" ");
                    for (let role of roles) {
                        console.log("called for jobrole : ", role);
                        coursesWithRoles.push({
                            role: role,
                            courses: yield (0, services_1.searchCoursesWithJobRole)({ jobRole: role })
                        });
                    }
                    // console.log("called for jobrole : ", job.role);
                    // coursesWithRole = await searchCoursesWithJobRole({jobRole: job.role});
                    // console.log("Courses with role : ", coursesWithRole);
                }
                enrichedJob = Object.assign(Object.assign({}, job), { courses: {
                        coursesWithSkills: coursesWithSkills,
                        coursesWithTitle: coursesWithTitle,
                        coursesWithRole: coursesWithRoles
                    } });
                enrichedJobs.push(enrichedJob);
            }
            enrichedJobResult = Object.assign({}, jobResult);
            enrichedJobResult.jobs = enrichedJobs;
            enrichedJobResults.push(enrichedJobResult);
        }
        console.log("Enriched job results returning : ", enrichedJobResults);
        return enrichedJobResults;
    });
}
exports.enrichJobResultsWithCourseData = enrichJobResultsWithCourseData;
const buildSavedAppliedJobResonse = (savedResponse = {}, appliedResponse = {}) => {
    var _a, _b;
    const savedInput = (_a = savedResponse === null || savedResponse === void 0 ? void 0 : savedResponse.data) === null || _a === void 0 ? void 0 : _a.jobs;
    const appliedInput = (_b = appliedResponse === null || appliedResponse === void 0 ? void 0 : appliedResponse.data) === null || _b === void 0 ? void 0 : _b.jobs;
    const jobMap = {
        saved: {}, applied: {}
    };
    if (savedResponse === null || savedResponse === void 0 ? void 0 : savedResponse.data) {
        savedInput.forEach(({ job_id }) => {
            jobMap['saved'][job_id] = true;
        });
    }
    if (appliedResponse === null || appliedResponse === void 0 ? void 0 : appliedResponse.data) {
        appliedInput.forEach(({ job_id }) => {
            jobMap['applied'][job_id] = true;
        });
    }
    return jobMap;
};
exports.buildSavedAppliedJobResonse = buildSavedAppliedJobResonse;
const buildSelectRequest = (input = {}) => {
    var _a, _b, _c, _d;
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
                { id: (_d = input === null || input === void 0 ? void 0 : input.jobs) === null || _d === void 0 ? void 0 : _d.jobId }
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
const buildOnSelectResponse = (response = {}, body = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, bppId, bppUri };
    const provider = (_e = (_d = input === null || input === void 0 ? void 0 : input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const items = (_g = (_f = input === null || input === void 0 ? void 0 : input.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.items;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_h = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _h === void 0 ? void 0 : _h.name,
        imageLink: (_k = (_j = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _j === void 0 ? void 0 : _j.images) === null || _k === void 0 ? void 0 : _k.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const selectedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
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
                var _a, _b;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_b = tag === null || tag === void 0 ? void 0 : tag.list) === null || _b === void 0 ? void 0 : _b.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const workExperience = (_o = item === null || item === void 0 ? void 0 : item.tags) === null || _o === void 0 ? void 0 : _o.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const responsibilities = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "responsibilities"; });
        const employmentInformation = (_q = item === null || item === void 0 ? void 0 : item.tags) === null || _q === void 0 ? void 0 : _q.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.workExperience = {
            key: (_s = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _s === void 0 ? void 0 : _s.name,
            experience: (_t = workExperience === null || workExperience === void 0 ? void 0 : workExperience.list) === null || _t === void 0 ? void 0 : _t.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.responsibilities = (_u = responsibilities === null || responsibilities === void 0 ? void 0 : responsibilities.list) === null || _u === void 0 ? void 0 : _u.map((li) => li.value);
        job.employmentInformation = {
            code: (_v = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _v === void 0 ? void 0 : _v.code,
            name: (_w = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _w === void 0 ? void 0 : _w.name,
            employmentInfo: (_x = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.list) === null || _x === void 0 ? void 0 : _x.map((li) => {
                var _a, _b;
                return ({
                    code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                    name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                    value: li === null || li === void 0 ? void 0 : li.value
                });
            })
        };
        job.compensation = {
            code: (_y = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _y === void 0 ? void 0 : _y.code,
            name: (_z = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _z === void 0 ? void 0 : _z.name,
            salaryInfo: (_0 = compensation === null || compensation === void 0 ? void 0 : compensation.list) === null || _0 === void 0 ? void 0 : _0.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        job.additionalFormUrl = (_2 = (_1 = item === null || item === void 0 ? void 0 : item.xinput) === null || _1 === void 0 ? void 0 : _1.form) === null || _2 === void 0 ? void 0 : _2.url;
        selectedJobs.push(job);
    });
    return { data: { context, company, selectedJobs } };
};
exports.buildOnSelectResponse = buildOnSelectResponse;
const buildInitRequest = (input) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
                { id: (_d = input === null || input === void 0 ? void 0 : input.jobs) === null || _d === void 0 ? void 0 : _d.jobId }
            ],
            fulfillments: (_e = input === null || input === void 0 ? void 0 : input.jobFulfillments) === null || _e === void 0 ? void 0 : _e.map((data) => {
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
                                return { url: data === null || data === void 0 ? void 0 : data.url, type: data === null || data === void 0 ? void 0 : data.type };
                            }),
                            skills: (_h = (_g = data === null || data === void 0 ? void 0 : data.jobApplicantProfile) === null || _g === void 0 ? void 0 : _g.skills) === null || _h === void 0 ? void 0 : _h.map((skill) => {
                                return { name: skill };
                            }),
                        }
                    }
                };
            }),
            xinput: {
                submission_id: (_f = input === null || input === void 0 ? void 0 : input.additionalFormData) === null || _f === void 0 ? void 0 : _f.submissionId,
                data: Object.fromEntries((_j = (_h = (_g = input === null || input === void 0 ? void 0 : input.additionalFormData) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.map((formData) => [formData === null || formData === void 0 ? void 0 : formData.formInputKey, formData === null || formData === void 0 ? void 0 : formData.formInputValue])) !== null && _j !== void 0 ? _j : [])
            }
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
    const context = (0, exports.buildContext)({ category: 'jobs', action: 'on_init', transactionId: input === null || input === void 0 ? void 0 : input.transactionId, messageId: input === null || input === void 0 ? void 0 : input.messageId, bppId: input === null || input === void 0 ? void 0 : input.bppId, bppUri: input === null || input === void 0 ? void 0 : input.bppUri });
    const message = {};
    return { payload: { context, message } };
};
exports.buildOnInitRequest = buildOnInitRequest;
const buildOnInitResponse = (response = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_e = (_d = input === null || input === void 0 ? void 0 : input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const items = (_g = (_f = input === null || input === void 0 ? void 0 : input.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.items;
    const xinput = (_j = (_h = input === null || input === void 0 ? void 0 : input.message) === null || _h === void 0 ? void 0 : _h.order) === null || _j === void 0 ? void 0 : _j.xinput;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_k = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _k === void 0 ? void 0 : _k.name,
        imageLink: (_m = (_l = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _l === void 0 ? void 0 : _l.images) === null || _m === void 0 ? void 0 : _m.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const initiatedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
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
                var _a, _b;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_b = tag === null || tag === void 0 ? void 0 : tag.list) === null || _b === void 0 ? void 0 : _b.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const responsibilities = (_o = item === null || item === void 0 ? void 0 : item.tags) === null || _o === void 0 ? void 0 : _o.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "responsibilities"; });
        const workExperience = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const employmentInformation = (_q = item === null || item === void 0 ? void 0 : item.tags) === null || _q === void 0 ? void 0 : _q.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.responsibilities = (_s = responsibilities === null || responsibilities === void 0 ? void 0 : responsibilities.list) === null || _s === void 0 ? void 0 : _s.map((li) => li.value);
        job.workExperience = {
            key: (_t = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _t === void 0 ? void 0 : _t.name,
            experience: (_u = workExperience === null || workExperience === void 0 ? void 0 : workExperience.list) === null || _u === void 0 ? void 0 : _u.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.employmentInformation = {
            code: (_v = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _v === void 0 ? void 0 : _v.code,
            name: (_w = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _w === void 0 ? void 0 : _w.name,
            employmentInfo: (_x = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.list) === null || _x === void 0 ? void 0 : _x.map((li) => {
                var _a, _b;
                return ({
                    code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code,
                    name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name,
                    value: li === null || li === void 0 ? void 0 : li.value
                });
            })
        };
        job.compensation = {
            code: (_y = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _y === void 0 ? void 0 : _y.code,
            name: (_z = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _z === void 0 ? void 0 : _z.name,
            salaryInfo: (_0 = compensation === null || compensation === void 0 ? void 0 : compensation.list) === null || _0 === void 0 ? void 0 : _0.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        initiatedJobs.push(job);
    });
    const jobFulfillments = (_p = (_o = input === null || input === void 0 ? void 0 : input.message) === null || _o === void 0 ? void 0 : _o.order) === null || _p === void 0 ? void 0 : _p.fulfillments.map((fulfilment) => {
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
    const additionalFormUrl = (_t = (_s = (_r = (_q = input === null || input === void 0 ? void 0 : input.message) === null || _q === void 0 ? void 0 : _q.order) === null || _r === void 0 ? void 0 : _r.xinput) === null || _s === void 0 ? void 0 : _s.form) === null || _t === void 0 ? void 0 : _t.url;
    const additionalFormData = (_v = Object.entries((_u = xinput === null || xinput === void 0 ? void 0 : xinput.data) !== null && _u !== void 0 ? _u : {})) === null || _v === void 0 ? void 0 : _v.map(([key, value]) => ({ formInputKey: key, formInputValue: value }));
    return { data: { context, company, initiatedJobs, jobFulfillments, additionalFormUrl, additionalFormData } };
};
exports.buildOnInitResponse = buildOnInitResponse;
const buildConfirmRequest = (input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
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
                {
                    id: input === null || input === void 0 ? void 0 : input.jobId,
                    fulfillment_ids: [(_d = input === null || input === void 0 ? void 0 : input.confirmation) === null || _d === void 0 ? void 0 : _d.JobFulfillmentCategoryId]
                }
            ],
            fulfillments: [{
                    id: (_e = input === null || input === void 0 ? void 0 : input.confirmation) === null || _e === void 0 ? void 0 : _e.JobFulfillmentCategoryId,
                    customer: {
                        person: {
                            name: (_g = (_f = input === null || input === void 0 ? void 0 : input.confirmation) === null || _f === void 0 ? void 0 : _f.jobApplicantProfile) === null || _g === void 0 ? void 0 : _g.name,
                            languages: (_k = (_j = (_h = input === null || input === void 0 ? void 0 : input.confirmation) === null || _h === void 0 ? void 0 : _h.jobApplicantProfile) === null || _j === void 0 ? void 0 : _j.languages) === null || _k === void 0 ? void 0 : _k.map((language) => ({ code: language })),
                            URL: (_m = (_l = input === null || input === void 0 ? void 0 : input.confirmation) === null || _l === void 0 ? void 0 : _l.jobApplicantProfile) === null || _m === void 0 ? void 0 : _m.url,
                            creds: (_p = (_o = input === null || input === void 0 ? void 0 : input.confirmation) === null || _o === void 0 ? void 0 : _o.jobApplicantProfile) === null || _p === void 0 ? void 0 : _p.creds.map((cred) => cred),
                            tags: [{ code: "func_skills", list: (_s = (_r = (_q = input === null || input === void 0 ? void 0 : input.confirmation) === null || _q === void 0 ? void 0 : _q.jobApplicantProfile) === null || _r === void 0 ? void 0 : _r.skills) === null || _s === void 0 ? void 0 : _s.map((skill) => ({ name: skill })) }],
                        }
                    }
                }]
        },
    };
    if (!(input === null || input === void 0 ? void 0 : input.companyId)) {
        (_t = message === null || message === void 0 ? void 0 : message.order) === null || _t === void 0 ? true : delete _t.provider;
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
const buildOnConfirmResponse = (response = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_e = (_d = input === null || input === void 0 ? void 0 : input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const items = (_g = (_f = input === null || input === void 0 ? void 0 : input.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.items;
    const xinput = (_j = (_h = input === null || input === void 0 ? void 0 : input.message) === null || _h === void 0 ? void 0 : _h.order) === null || _j === void 0 ? void 0 : _j.xinput;
    const applicationId = (_l = (_k = input === null || input === void 0 ? void 0 : input.message) === null || _k === void 0 ? void 0 : _k.order) === null || _l === void 0 ? void 0 : _l.id;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_m = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _m === void 0 ? void 0 : _m.name,
        imageLink: (_p = (_o = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _o === void 0 ? void 0 : _o.images) === null || _p === void 0 ? void 0 : _p.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const confirmedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
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
                var _a, _b;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_b = tag === null || tag === void 0 ? void 0 : tag.list) === null || _b === void 0 ? void 0 : _b.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const responsibilities = (_o = item === null || item === void 0 ? void 0 : item.tags) === null || _o === void 0 ? void 0 : _o.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "responsibilities"; });
        const workExperience = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const employmentInformation = (_q = item === null || item === void 0 ? void 0 : item.tags) === null || _q === void 0 ? void 0 : _q.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.responsibilities = (_s = responsibilities === null || responsibilities === void 0 ? void 0 : responsibilities.list) === null || _s === void 0 ? void 0 : _s.map((li) => li.value);
        job.workExperience = {
            key: (_t = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _t === void 0 ? void 0 : _t.name,
            experience: (_u = workExperience === null || workExperience === void 0 ? void 0 : workExperience.list) === null || _u === void 0 ? void 0 : _u.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.employmentInformation = {
            code: (_v = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _v === void 0 ? void 0 : _v.code,
            name: (_w = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _w === void 0 ? void 0 : _w.name,
            employmentInfo: {
                code: (_z = (_y = (_x = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.list) === null || _x === void 0 ? void 0 : _x[0]) === null || _y === void 0 ? void 0 : _y.descriptor) === null || _z === void 0 ? void 0 : _z.code,
                name: (_2 = (_1 = (_0 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.list) === null || _0 === void 0 ? void 0 : _0[0]) === null || _1 === void 0 ? void 0 : _1.descriptor) === null || _2 === void 0 ? void 0 : _2.name,
                value: (_4 = (_3 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.list) === null || _3 === void 0 ? void 0 : _3[0]) === null || _4 === void 0 ? void 0 : _4.value
            }
        };
        job.compensation = {
            code: (_5 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _5 === void 0 ? void 0 : _5.code,
            name: (_6 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _6 === void 0 ? void 0 : _6.name,
            salaryInfo: (_7 = compensation === null || compensation === void 0 ? void 0 : compensation.list) === null || _7 === void 0 ? void 0 : _7.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        confirmedJobs.push(job);
    });
    const jobFulfillments = (_r = (_q = input === null || input === void 0 ? void 0 : input.message) === null || _q === void 0 ? void 0 : _q.order) === null || _r === void 0 ? void 0 : _r.fulfillments.map((fulfilment) => {
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
    const additionalFormData = (_t = Object.entries((_s = xinput === null || xinput === void 0 ? void 0 : xinput.data) !== null && _s !== void 0 ? _s : {})) === null || _t === void 0 ? void 0 : _t.map(([key, value]) => ({ formInputKey: key, formInputValue: value }));
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
        order_id: input === null || input === void 0 ? void 0 : input.applicationId
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
const buildOnStatusResponse = (response = {}) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    const input = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b[0];
    if (!input)
        return { status: 200 };
    const { transaction_id: transactionId, message_id: messageId, bpp_id: bppId, bpp_uri: bppUri } = (_c = input === null || input === void 0 ? void 0 : input.context) !== null && _c !== void 0 ? _c : {};
    const context = { transactionId, messageId, bppId, bppUri };
    const provider = (_e = (_d = input === null || input === void 0 ? void 0 : input.message) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.provider;
    const items = (_g = (_f = input === null || input === void 0 ? void 0 : input.message) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.items;
    const xinput = (_j = (_h = input === null || input === void 0 ? void 0 : input.message) === null || _h === void 0 ? void 0 : _h.order) === null || _j === void 0 ? void 0 : _j.xinput;
    const applicationId = (_l = (_k = input === null || input === void 0 ? void 0 : input.message) === null || _k === void 0 ? void 0 : _k.order) === null || _l === void 0 ? void 0 : _l.id;
    const company = {
        id: provider === null || provider === void 0 ? void 0 : provider.id,
        name: (_m = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _m === void 0 ? void 0 : _m.name,
        imageLink: (_p = (_o = provider === null || provider === void 0 ? void 0 : provider.descriptor) === null || _o === void 0 ? void 0 : _o.images) === null || _p === void 0 ? void 0 : _p.map((image) => ({ url: image === null || image === void 0 ? void 0 : image.url, size: image === null || image === void 0 ? void 0 : image.size_type }))
    };
    const confirmedJobs = [];
    items === null || items === void 0 ? void 0 : items.forEach((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
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
                var _a, _b;
                return ({
                    category: (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name,
                    qualification: (_b = tag === null || tag === void 0 ? void 0 : tag.list) === null || _b === void 0 ? void 0 : _b.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
                });
            })
        };
        const responsibilities = (_o = item === null || item === void 0 ? void 0 : item.tags) === null || _o === void 0 ? void 0 : _o.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "responsibilities"; });
        const workExperience = (_p = item === null || item === void 0 ? void 0 : item.tags) === null || _p === void 0 ? void 0 : _p.find((tag) => { var _a, _b; return ((_b = (_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == "work experience"; });
        const employmentInformation = (_q = item === null || item === void 0 ? void 0 : item.tags) === null || _q === void 0 ? void 0 : _q.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "employment-info"; });
        const compensation = (_r = item === null || item === void 0 ? void 0 : item.tags) === null || _r === void 0 ? void 0 : _r.find((tag) => { var _a; return ((_a = tag === null || tag === void 0 ? void 0 : tag.descriptor) === null || _a === void 0 ? void 0 : _a.code) == "salary-info"; });
        job.responsibilities = (_s = responsibilities === null || responsibilities === void 0 ? void 0 : responsibilities.list) === null || _s === void 0 ? void 0 : _s.map((li) => li.value);
        job.workExperience = {
            key: (_t = workExperience === null || workExperience === void 0 ? void 0 : workExperience.descriptor) === null || _t === void 0 ? void 0 : _t.name,
            experience: (_u = workExperience === null || workExperience === void 0 ? void 0 : workExperience.list) === null || _u === void 0 ? void 0 : _u.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); })
        };
        job.employmentInformation = {
            code: (_v = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _v === void 0 ? void 0 : _v.code,
            name: (_w = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.descriptor) === null || _w === void 0 ? void 0 : _w.name,
            employmentInfo: {
                code: (_z = (_y = (_x = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.list) === null || _x === void 0 ? void 0 : _x[0]) === null || _y === void 0 ? void 0 : _y.descriptor) === null || _z === void 0 ? void 0 : _z.code,
                name: (_2 = (_1 = (_0 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.list) === null || _0 === void 0 ? void 0 : _0[0]) === null || _1 === void 0 ? void 0 : _1.descriptor) === null || _2 === void 0 ? void 0 : _2.name,
                value: (_4 = (_3 = employmentInformation === null || employmentInformation === void 0 ? void 0 : employmentInformation.list) === null || _3 === void 0 ? void 0 : _3[0]) === null || _4 === void 0 ? void 0 : _4.value
            }
        };
        job.compensation = {
            code: (_5 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _5 === void 0 ? void 0 : _5.code,
            name: (_6 = compensation === null || compensation === void 0 ? void 0 : compensation.descriptor) === null || _6 === void 0 ? void 0 : _6.name,
            salaryInfo: (_7 = compensation === null || compensation === void 0 ? void 0 : compensation.list) === null || _7 === void 0 ? void 0 : _7.map((li) => { var _a, _b; return ({ code: (_a = li === null || li === void 0 ? void 0 : li.descriptor) === null || _a === void 0 ? void 0 : _a.code, name: (_b = li === null || li === void 0 ? void 0 : li.descriptor) === null || _b === void 0 ? void 0 : _b.name, value: li === null || li === void 0 ? void 0 : li.value }); }),
        };
        confirmedJobs.push(job);
    });
    const jobFulfillments = (_r = (_q = input === null || input === void 0 ? void 0 : input.message) === null || _q === void 0 ? void 0 : _q.order) === null || _r === void 0 ? void 0 : _r.fulfillments.map((fulfilment) => {
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
    const additionalFormUrl = (_s = xinput === null || xinput === void 0 ? void 0 : xinput.form) === null || _s === void 0 ? void 0 : _s.url;
    const additionalFormData = (_u = Object.entries((_t = xinput === null || xinput === void 0 ? void 0 : xinput.data) !== null && _t !== void 0 ? _t : {})) === null || _u === void 0 ? void 0 : _u.map(([key, value]) => ({ formInputKey: key, formInputValue: value }));
    return { data: { context, applicationId, company, confirmedJobs, jobFulfillments, additionalFormUrl, additionalFormData } };
};
exports.buildOnStatusResponse = buildOnStatusResponse;

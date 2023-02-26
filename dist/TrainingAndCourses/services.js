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
exports.selectTrainingService = exports.statusTrainingService = exports.confirmTrainingService = exports.initTrainingService = exports.searchCoursesWithJobSkill = exports.searchCoursesWithJobRole = exports.searchCoursesWithJobTitle = exports.searchTrainingService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_build_helper_1 = require("./schema-build-helper");
const searchTrainingResponse_json_1 = __importDefault(require("./mocks/searchTrainingResponse.json"));
const initTrainingResponse_json_1 = __importDefault(require("./mocks/initTrainingResponse.json"));
const confirmTrainingResponse_json_1 = __importDefault(require("./mocks/confirmTrainingResponse.json"));
const selectTrainingResponse_json_1 = __importDefault(require("./mocks/selectTrainingResponse.json"));
dotenv_1.default.config();
const gatewayUrl = process.env.GATEWAY_URL;
const trainingNetwork = process.env.TRAINING_NETWORK;
const backendApiUrl = process.env.BACKEND_API_BASE_URL;
const searchTrainingService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // const gatewayUrl = process.env.GATEWAY_URL;
    // const trainingNetwork = process.env.TRAINING_NETWORK;
    // const backendApiUrl = process.env.BACKEND_API_BASE_URL;
    try {
        const { payload, optional } = (0, schema_build_helper_1.buildSearchRequest)(body);
        console.log(JSON.stringify(payload));
        let searchResponse = {};
        if (trainingNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            const searchRes = yield axios_1.default.post(`${gatewayUrl}/search`, payload, { headers });
            const itemRes = yield Promise.all([
                ((_a = optional === null || optional === void 0 ? void 0 : optional.user) === null || _a === void 0 ? void 0 : _a.email) ? axios_1.default.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                ((_b = optional === null || optional === void 0 ? void 0 : optional.user) === null || _b === void 0 ? void 0 : _b.email) ? axios_1.default.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
            ]).then(res => res).catch(err => null);
            const res = { searchRes, itemRes };
            console.log("Calling buildOnSearchMergedResponse");
            searchResponse = yield (0, schema_build_helper_1.buildOnSearchMergedResponse)(res, body);
            console.log("returned search Response : ", yield searchResponse.json);
            // let courses = searchResponse.data.courses;
            // let enrichedCourses = await enrichCoursesWithRelevantJobs(courses)
            // searchResponse.data.courses = enrichedCourses;
            console.log("returned search Response : ", searchResponse);
        }
        else {
            searchResponse = (0, schema_build_helper_1.buildSearchResponse)({ data: searchTrainingResponse_json_1.default }, body);
        }
        return searchResponse;
    }
    catch (error) {
        console.log(error);
        return { error: error, errorOccured: true };
    }
});
exports.searchTrainingService = searchTrainingService;
const searchCoursesWithJobTitle = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    // const gatewayUrl = process.env.GATEWAY_URL;
    // const trainingNetwork = process.env.TRAINING_NETWORK;
    // const backendApiUrl = process.env.BACKEND_API_BASE_URL;
    console.log("Called for courses with gateway url : ", gatewayUrl);
    try {
        const { payload, optional } = (0, schema_build_helper_1.buildSearchRequestWithJobTitle)(body);
        console.log(JSON.stringify(payload));
        let searchResponse = {};
        if (trainingNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            const searchRes = yield axios_1.default.post(`${gatewayUrl}/search`, payload, { headers });
            const itemRes = yield Promise.all([
                ((_c = optional === null || optional === void 0 ? void 0 : optional.user) === null || _c === void 0 ? void 0 : _c.email) ? axios_1.default.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                ((_d = optional === null || optional === void 0 ? void 0 : optional.user) === null || _d === void 0 ? void 0 : _d.email) ? axios_1.default.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
            ]).then(res => res).catch(err => null);
            const res = { searchRes, itemRes };
            console.log("Calling buildOnSearchMergedResponse");
            searchResponse = yield (0, schema_build_helper_1.buildOnSearchMergedResponse)(res, body, true);
            console.log("returned search Response : ", yield searchResponse.json);
            // let courses = searchResponse.data.courses;
            // let enrichedCourses = await enrichCoursesWithRelevantJobs(courses)
            // searchResponse.data.courses = enrichedCourses;
            console.log("returned search Response : ", searchResponse);
        }
        else {
            searchResponse = (0, schema_build_helper_1.buildSearchResponse)({ data: searchTrainingResponse_json_1.default }, body, [], [], true);
        }
        return searchResponse;
    }
    catch (error) {
        console.log(error);
        return { error: error, errorOccured: true };
    }
});
exports.searchCoursesWithJobTitle = searchCoursesWithJobTitle;
const searchCoursesWithJobRole = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    // const gatewayUrl = process.env.GATEWAY_URL;
    // const trainingNetwork = process.env.TRAINING_NETWORK;
    // const backendApiUrl = process.env.BACKEND_API_BASE_URL;
    console.log("Called for courses with gateway url : ", gatewayUrl);
    try {
        const { payload, optional } = (0, schema_build_helper_1.buildSearchRequestWithJobRole)(body.jobRole);
        console.log(JSON.stringify(payload));
        let searchResponse = {};
        if (trainingNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            const searchRes = yield axios_1.default.post(`${gatewayUrl}/search`, payload, { headers });
            const itemRes = yield Promise.all([
                ((_e = optional === null || optional === void 0 ? void 0 : optional.user) === null || _e === void 0 ? void 0 : _e.email) ? axios_1.default.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                ((_f = optional === null || optional === void 0 ? void 0 : optional.user) === null || _f === void 0 ? void 0 : _f.email) ? axios_1.default.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
            ]).then(res => res).catch(err => null);
            const res = { searchRes, itemRes };
            console.log("Calling buildOnSearchMergedResponse");
            searchResponse = yield (0, schema_build_helper_1.buildOnSearchMergedResponse)(res, body, true);
            // console.log("returned search Response : ",await searchResponse.json);
            // let courses = searchResponse.data.courses;
            // let enrichedCourses = await enrichCoursesWithRelevantJobs(courses)
            // searchResponse.data.courses = enrichedCourses;
            console.log("returned search Response : ", searchResponse);
        }
        else {
            searchResponse = (0, schema_build_helper_1.buildSearchResponse)({ data: searchTrainingResponse_json_1.default }, body, [], [], true);
        }
        return searchResponse;
    }
    catch (error) {
        console.log(error);
        return { error: error, errorOccured: true };
    }
});
exports.searchCoursesWithJobRole = searchCoursesWithJobRole;
const searchCoursesWithJobSkill = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    // const gatewayUrl = process.env.GATEWAY_URL;
    // const trainingNetwork = process.env.TRAINING_NETWORK;
    // const backendApiUrl = process.env.BACKEND_API_BASE_URL;
    console.log("Called for courses with gateway url : ", `${gatewayUrl}`);
    try {
        const { payload, optional } = (0, schema_build_helper_1.buildSearchRequestWithJobSkill)(body.skill);
        console.log(JSON.stringify(payload));
        let searchResponse = {};
        if (trainingNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            const searchRes = yield axios_1.default.post(`${gatewayUrl}/search`, payload, { headers });
            const itemRes = yield Promise.all([
                ((_g = optional === null || optional === void 0 ? void 0 : optional.user) === null || _g === void 0 ? void 0 : _g.email) ? axios_1.default.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                ((_h = optional === null || optional === void 0 ? void 0 : optional.user) === null || _h === void 0 ? void 0 : _h.email) ? axios_1.default.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
            ]).then(res => res).catch(err => null);
            const res = { searchRes, itemRes };
            console.log("Calling buildOnSearchMergedResponse");
            searchResponse = yield (0, schema_build_helper_1.buildOnSearchMergedResponse)(res, body, true);
            console.log("returned search Response : ", yield searchResponse.json);
            // let courses = searchResponse.data.courses;
            // let enrichedCourses = await enrichCoursesWithRelevantJobs(courses)
            // searchResponse.data.courses = enrichedCourses;
            console.log("returned search Response : ", searchResponse);
        }
        else {
            searchResponse = (0, schema_build_helper_1.buildSearchResponse)({ data: searchTrainingResponse_json_1.default }, body, [], [], true);
        }
        return searchResponse;
    }
    catch (error) {
        console.log(error);
        return { error: error, errorOccured: true };
    }
});
exports.searchCoursesWithJobSkill = searchCoursesWithJobSkill;
const initTrainingService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const initRequest = (0, schema_build_helper_1.buildInitRequest)(body);
        console.log(JSON.stringify(initRequest.payload));
        let initResponse = {};
        if (trainingNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios_1.default.post(`${gatewayUrl}/init`, initRequest.payload, { headers });
            initResponse = (0, schema_build_helper_1.buildInitResponse)(res, body);
        }
        else {
            initResponse = (0, schema_build_helper_1.buildInitResponse)({ data: initTrainingResponse_json_1.default }, body);
        }
        return initResponse;
    }
    catch (error) {
        console.log(JSON.stringify((_j = error === null || error === void 0 ? void 0 : error.response) === null || _j === void 0 ? void 0 : _j.data));
        return { error: error, errorOccured: true };
    }
});
exports.initTrainingService = initTrainingService;
const confirmTrainingService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const confirmRequest = (0, schema_build_helper_1.buildConfirmRequest)(body);
        console.log(JSON.stringify(confirmRequest.payload));
        let confirmResponse = {};
        if (trainingNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios_1.default.post(`${gatewayUrl}/confirm`, confirmRequest.payload, { headers });
            confirmResponse = (0, schema_build_helper_1.buildConfirmResponse)(res, body);
        }
        else {
            confirmResponse = (0, schema_build_helper_1.buildConfirmResponse)({ data: confirmTrainingResponse_json_1.default }, body);
        }
        return confirmResponse;
    }
    catch (error) {
        console.log(error);
        return { error: error, errorOccured: true };
    }
});
exports.confirmTrainingService = confirmTrainingService;
const statusTrainingService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statusRequest = (0, schema_build_helper_1.buildStatusRequest)(body);
        console.log(JSON.stringify(statusRequest.payload));
        let statusResponse = {};
        if (trainingNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios_1.default.post(`${gatewayUrl}/search`, statusRequest.payload, { headers });
            statusResponse = (0, schema_build_helper_1.buildStatusResponse)(res === null || res === void 0 ? void 0 : res.data, body);
        }
        else {
            statusResponse = (0, schema_build_helper_1.buildStatusResponse)(selectTrainingResponse_json_1.default, body);
        }
        return { data: statusResponse };
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.statusTrainingService = statusTrainingService;
const selectTrainingService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectRequest = (0, schema_build_helper_1.buildSelectRequest)(body);
        console.log(JSON.stringify(selectRequest.payload));
        let selectResponse = {};
        if (trainingNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios_1.default.post(`${gatewayUrl}/select`, selectRequest.payload, { headers });
            selectResponse = (0, schema_build_helper_1.buildSelectResponse)(res, body);
        }
        else {
            selectResponse = (0, schema_build_helper_1.buildSelectResponse)({ data: selectTrainingResponse_json_1.default }, body);
        }
        return selectResponse;
    }
    catch (error) {
        console.log(error);
        return { error: error, errorOccured: true };
    }
});
exports.selectTrainingService = selectTrainingService;

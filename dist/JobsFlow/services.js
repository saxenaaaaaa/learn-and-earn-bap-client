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
exports.onStatusJob = exports.statusJob = exports.onConfirmJob = exports.confirmJob = exports.onInitJob = exports.initJob = exports.onSelectJob = exports.selectJob = exports.onSearchJob = exports.searchJobWithCourseName = exports.searchJobWithCourseCategory = exports.searchJobWithCourseProvider = exports.searchJob = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const https_1 = __importDefault(require("https"));
const schema_helper_1 = require("./schema_helper");
const onSelectResponse_json_1 = __importDefault(require("./mock/onSelectResponse.json"));
const onSearchResponse_json_1 = __importDefault(require("./mock/onSearchResponse.json"));
const onInitResponse_json_1 = __importDefault(require("./mock/onInitResponse.json"));
const onConfirmResponse_json_1 = __importDefault(require("./mock/onConfirmResponse.json"));
const onStatusResponse_json_1 = __importDefault(require("./mock/onStatusResponse.json"));
dotenv_1.default.config();
const gatewayUrl = process.env.GATEWAY_URL || "";
const jobNetwork = process.env.JOB_NETWORK;
const backendApiUrl = process.env.BACKEND_API_BASE_URL;
const axios = axios_1.default.create({
    httpsAgent: new https_1.default.Agent({
        rejectUnauthorized: false
    })
});
function searchJob(body) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Called for job with gateway url : ", `${gatewayUrl}`);
            const { payload, optional } = (0, schema_helper_1.buildSearchRequest)(body);
            console.log(JSON.stringify(payload));
            let response = { data: onSearchResponse_json_1.default };
            if (jobNetwork != 'local') {
                const headers = { "Content-Type": "application/JSON" };
                const searchRes = yield axios.post(`${gatewayUrl}/search`, payload, { headers });
                const itemRes = yield Promise.all([
                    ((_a = optional === null || optional === void 0 ? void 0 : optional.user) === null || _a === void 0 ? void 0 : _a.email) ? axios.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                    ((_b = optional === null || optional === void 0 ? void 0 : optional.user) === null || _b === void 0 ? void 0 : _b.email) ? axios.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
                ]).then(res => res).catch(err => null);
                response = { searchRes, itemRes };
            }
            return yield (0, schema_helper_1.buildOnSearchMergedResponse)(response, body);
        }
        catch (error) {
            return { error: JSON.stringify(error), errorOccured: true };
        }
    });
}
exports.searchJob = searchJob;
function searchJobWithCourseProvider(course) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload, optional } = (0, schema_helper_1.buildSearchRequestForJobWithCourseProvider)(course);
            console.log("Payload for course provider request : ", payload);
            console.log(JSON.stringify(payload));
            let response = { data: onSearchResponse_json_1.default };
            if (jobNetwork != 'local') {
                const headers = { "Content-Type": "application/JSON" };
                const searchRes = yield axios.post(`${gatewayUrl}/search`, payload, { headers });
                const itemRes = yield Promise.all([
                    ((_a = optional === null || optional === void 0 ? void 0 : optional.user) === null || _a === void 0 ? void 0 : _a.email) ? axios.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                    ((_b = optional === null || optional === void 0 ? void 0 : optional.user) === null || _b === void 0 ? void 0 : _b.email) ? axios.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
                ]).then(res => res).catch(err => null);
                response = { searchRes, itemRes };
            }
            return (0, schema_helper_1.buildOnSearchMergedResponse)(response, true);
        }
        catch (error) {
            return { error: JSON.stringify(error), errorOccured: true };
        }
    });
}
exports.searchJobWithCourseProvider = searchJobWithCourseProvider;
function searchJobWithCourseCategory(course) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload, optional } = (0, schema_helper_1.buildSearchRequestForJobWithCourseCategory)(course);
            console.log("Payload for course category request : ", payload);
            console.log(JSON.stringify(payload));
            let response = { data: onSearchResponse_json_1.default };
            if (jobNetwork != 'local') {
                const headers = { "Content-Type": "application/JSON" };
                const searchRes = yield axios.post(`${gatewayUrl}/search`, payload, { headers });
                const itemRes = yield Promise.all([
                    ((_a = optional === null || optional === void 0 ? void 0 : optional.user) === null || _a === void 0 ? void 0 : _a.email) ? axios.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                    ((_b = optional === null || optional === void 0 ? void 0 : optional.user) === null || _b === void 0 ? void 0 : _b.email) ? axios.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
                ]).then(res => res).catch(err => null);
                response = { searchRes, itemRes };
            }
            return (0, schema_helper_1.buildOnSearchMergedResponse)(response, true);
        }
        catch (error) {
            return { error: JSON.stringify(error), errorOccured: true };
        }
    });
}
exports.searchJobWithCourseCategory = searchJobWithCourseCategory;
function searchJobWithCourseName(course) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload, optional } = (0, schema_helper_1.buildSearchRequestForJobWithCourseName)(course);
            console.log(JSON.stringify(payload));
            let response = { data: onSearchResponse_json_1.default };
            if (jobNetwork != 'local') {
                const headers = { "Content-Type": "application/JSON" };
                const searchRes = yield axios.post(`${gatewayUrl}/search`, payload, { headers });
                const itemRes = yield Promise.all([
                    ((_a = optional === null || optional === void 0 ? void 0 : optional.user) === null || _a === void 0 ? void 0 : _a.email) ? axios.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                    ((_b = optional === null || optional === void 0 ? void 0 : optional.user) === null || _b === void 0 ? void 0 : _b.email) ? axios.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
                ]).then(res => res).catch(err => null);
                response = { searchRes, itemRes };
            }
            return (0, schema_helper_1.buildOnSearchMergedResponse)(response, true);
        }
        catch (error) {
            return { error: JSON.stringify(error), errorOccured: true };
        }
    });
}
exports.searchJobWithCourseName = searchJobWithCourseName;
function onSearchJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildOnSearchRequest)(body);
            const headers = { "Content-Type": "application/JSON" };
            let response = yield axios.post(`${gatewayUrl}/on_search`, payload, { headers });
            return (0, schema_helper_1.buildOnSearchResponse)(response === null || response === void 0 ? void 0 : response.data, body);
        }
        catch (error) {
            return { error: error, errorOccured: true };
        }
    });
}
exports.onSearchJob = onSearchJob;
function selectJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildSelectRequest)(body);
            console.log(JSON.stringify(payload));
            let response = { data: onSelectResponse_json_1.default };
            if (jobNetwork != 'local') {
                const headers = { "Content-Type": "application/JSON" };
                let res = yield axios.post(`${gatewayUrl}/select`, payload, { headers });
                response = res;
            }
            return (0, schema_helper_1.buildOnSelectResponse)(response, body);
        }
        catch (error) {
            return { error: error, errorOccured: true };
        }
    });
}
exports.selectJob = selectJob;
function onSelectJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildOnSelectRequest)(body);
            const headers = { "Content-Type": "application/JSON" };
            let response = yield axios.post(`${gatewayUrl}/on_select`, payload, { headers });
            return (0, schema_helper_1.buildOnSelectResponse)(response === null || response === void 0 ? void 0 : response.data, body);
        }
        catch (error) {
            return { error: error, errorOccured: true, };
        }
    });
}
exports.onSelectJob = onSelectJob;
function initJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildInitRequest)(body);
            console.log(JSON.stringify(payload));
            let response = { data: onInitResponse_json_1.default };
            if (jobNetwork != 'local') {
                const headers = { "Content-Type": "application/JSON" };
                let res = yield axios.post(`${gatewayUrl}/init`, payload, { headers });
                response = res;
            }
            return (0, schema_helper_1.buildOnInitResponse)(response);
        }
        catch (error) {
            console.log(error);
            return { error: error, errorOccured: true };
        }
    });
}
exports.initJob = initJob;
function onInitJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildOnInitRequest)(body);
            const headers = { "Content-Type": "application/JSON" };
            let response = yield axios.post(`${gatewayUrl}/on_init`, payload, { headers });
            return (0, schema_helper_1.buildOnInitResponse)(response === null || response === void 0 ? void 0 : response.data);
        }
        catch (error) {
            return { error: error, errorOccured: true };
        }
    });
}
exports.onInitJob = onInitJob;
function confirmJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildConfirmRequest)(body);
            console.log(JSON.stringify(payload));
            let response = { data: onConfirmResponse_json_1.default };
            if (jobNetwork != 'local') {
                const headers = { "Content-Type": "application/JSON" };
                let res = yield axios.post(`${gatewayUrl}/confirm`, payload, { headers });
                response = res;
            }
            return (0, schema_helper_1.buildOnConfirmResponse)(response);
        }
        catch (error) {
            return { error: error, errorOccured: true };
        }
    });
}
exports.confirmJob = confirmJob;
function onConfirmJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildOnConfirmRequest)(body);
            const headers = { "Content-Type": "application/JSON" };
            let response = yield axios.post(`${gatewayUrl}/on_confirm`, payload, { headers });
            return (0, schema_helper_1.buildOnConfirmResponse)(response.data);
        }
        catch (error) {
            return { error: error, errorOccured: true };
        }
    });
}
exports.onConfirmJob = onConfirmJob;
function statusJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildStatusRequest)(body);
            console.log(JSON.stringify(payload));
            let response = { data: onStatusResponse_json_1.default };
            if (jobNetwork != 'local') {
                const headers = { "Content-Type": "application/JSON" };
                let res = yield axios.post(`${gatewayUrl}/status`, payload, { headers });
                response = res;
            }
            return (0, schema_helper_1.buildOnStatusResponse)(response);
        }
        catch (error) {
            return { error: error, errorOccured: true };
        }
    });
}
exports.statusJob = statusJob;
function onStatusJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = (0, schema_helper_1.buildOnStatusRequest)(body);
            const headers = { "Content-Type": "application/JSON" };
            let response = yield axios.post(`${gatewayUrl}/on_status`, payload, { headers });
            return (0, schema_helper_1.buildOnStatusResponse)(response.data);
        }
        catch (error) {
            return { error: error, errorOccured: true };
        }
    });
}
exports.onStatusJob = onStatusJob;

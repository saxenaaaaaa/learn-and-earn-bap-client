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
exports.statusScholarshipService = exports.confirmScholarshipService = exports.initScholarshipService = exports.selectScholarshipService = exports.searchScholarshipService = void 0;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const schema_build_helper_1 = require("./schema-build-helper");
const searchScholarshipResponse_json_1 = __importDefault(require("./mocks/searchScholarshipResponse.json"));
const initScholarshipResponse_json_1 = __importDefault(require("./mocks/initScholarshipResponse.json"));
const confirmScholarshipReponse_json_1 = __importDefault(require("./mocks/confirmScholarshipReponse.json"));
const statusScholarshipReponse_json_1 = __importDefault(require("./mocks/statusScholarshipReponse.json"));
const selectScholarshipResponse_json_1 = __importDefault(require("./mocks/selectScholarshipResponse.json"));
const gatewayUrl = "https://dsep-protocol-client.becknprotocol.io";
const scholarshipNetwork = process.env.SCHOLARSHIP_NETWORK;
const backendApiUrl = process.env.BACKEND_API_BASE_URL;
const axios = axios_1.default.create({
    httpsAgent: new https_1.default.Agent({
        rejectUnauthorized: false
    })
});
const searchScholarshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { payload, optional } = (0, schema_build_helper_1.buildSearchRequest)(body);
        console.log(JSON.stringify(payload));
        let searchResponse = {};
        if (scholarshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            const searchRes = yield axios.post(`${gatewayUrl}/search`, payload, { headers });
            const itemRes = yield Promise.all([
                ((_a = optional === null || optional === void 0 ? void 0 : optional.user) === null || _a === void 0 ? void 0 : _a.email) ? axios.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                ((_b = optional === null || optional === void 0 ? void 0 : optional.user) === null || _b === void 0 ? void 0 : _b.email) ? axios.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
            ]).then(res => res).catch(err => null);
            const res = { searchRes, itemRes };
            searchResponse = (0, schema_build_helper_1.buildOnSearchMergedResponse)(res, body);
        }
        else {
            searchResponse = (0, schema_build_helper_1.buildSearchResponse)({ data: searchScholarshipResponse_json_1.default }, body);
        }
        return searchResponse;
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.searchScholarshipService = searchScholarshipService;
const selectScholarshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectRequest = (0, schema_build_helper_1.buildSelectRequest)(body);
        console.log(JSON.stringify(selectRequest.payload));
        let selectResponse = {};
        if (scholarshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/select`, selectRequest.payload, {
                headers
            });
            selectResponse = (0, schema_build_helper_1.buildSelectResponse)(res, body);
        }
        else {
            selectResponse = (0, schema_build_helper_1.buildSelectResponse)({ data: selectScholarshipResponse_json_1.default }, body);
        }
        return selectResponse;
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.selectScholarshipService = selectScholarshipService;
const initScholarshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const initRequest = (0, schema_build_helper_1.buildInitRequest)(body);
        console.log(JSON.stringify(initRequest.payload));
        let initResponse = {};
        if (scholarshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/init`, initRequest.payload, {
                headers
            });
            initResponse = (0, schema_build_helper_1.buildInitResponse)(res === null || res === void 0 ? void 0 : res.data, body);
        }
        else {
            initResponse = (0, schema_build_helper_1.buildInitResponse)(initScholarshipResponse_json_1.default, body);
        }
        return { data: initResponse };
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.initScholarshipService = initScholarshipService;
const confirmScholarshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const confirmRequest = (0, schema_build_helper_1.buildConfirmRequest)(body);
        console.log(JSON.stringify(confirmRequest.payload));
        let confirmResponse = {};
        if (scholarshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/confirm`, confirmRequest.payload, { headers });
            confirmResponse = (0, schema_build_helper_1.buildConfirmResponse)(res === null || res === void 0 ? void 0 : res.data, body);
        }
        else {
            confirmResponse = (0, schema_build_helper_1.buildConfirmResponse)({ data: confirmScholarshipReponse_json_1.default }, body);
        }
        return { data: confirmResponse };
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.confirmScholarshipService = confirmScholarshipService;
const statusScholarshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statusRequest = (0, schema_build_helper_1.buildStatusRequest)(body);
        console.log(JSON.stringify(statusRequest.payload));
        let statusResponse = {};
        if (scholarshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/status`, statusRequest.payload, { headers });
            statusResponse = (0, schema_build_helper_1.buildStatusResponse)(res, body);
        }
        else {
            statusResponse = (0, schema_build_helper_1.buildStatusResponse)({ data: statusScholarshipReponse_json_1.default }, body);
        }
        return statusResponse;
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.statusScholarshipService = statusScholarshipService;

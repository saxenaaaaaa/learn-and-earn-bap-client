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
exports.cancelMentorshipService = exports.statusMentorshipService = exports.initMentorshipService = exports.confirmMentorshipService = exports.selectMentorshipService = exports.searchMentorShipService = void 0;
const schema_build_helpers_1 = require("./schema-build-helpers");
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const searchMentorShipReponse_json_1 = __importDefault(require("./mocks/searchMentorShipReponse.json"));
const selectMentorShipResponse_json_1 = __importDefault(require("./mocks/selectMentorShipResponse.json"));
const confirmMentorShipResponse_json_1 = __importDefault(require("./mocks/confirmMentorShipResponse.json"));
const statusMentorShipResponse_json_1 = __importDefault(require("./mocks/statusMentorShipResponse.json"));
const cancelMentorShipResponse_json_1 = __importDefault(require("./mocks/cancelMentorShipResponse.json"));
const initMentorShipResponse_json_1 = __importDefault(require("./mocks/initMentorShipResponse.json"));
const gatewayUrl = "https://dsep-protocol-client.becknprotocol.io";
const mentorshipNetwork = process.env.MENTORSHIP_NETWORK;
const backendApiUrl = process.env.BACKEND_API_BASE_URL;
const axios = axios_1.default.create({
    httpsAgent: new https_1.default.Agent({
        rejectUnauthorized: false
    })
});
const searchMentorShipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { payload, optional } = (0, schema_build_helpers_1.buildSearchRequest)(body);
        console.log(JSON.stringify(payload));
        let searchResponse = {};
        if (mentorshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            const searchRes = yield axios.post(`${gatewayUrl}/search`, payload, { headers });
            const itemRes = yield Promise.all([
                ((_a = optional === null || optional === void 0 ? void 0 : optional.user) === null || _a === void 0 ? void 0 : _a.email) ? axios.get(`${backendApiUrl}/user/item/saved/${optional.user.email}`, { headers }) : null,
                ((_b = optional === null || optional === void 0 ? void 0 : optional.user) === null || _b === void 0 ? void 0 : _b.email) ? axios.get(`${backendApiUrl}/user/item/applied/${optional.user.email}`, { headers }) : null
            ]).then(res => res).catch(err => null);
            const res = { searchRes, itemRes };
            searchResponse = (0, schema_build_helpers_1.buildSearchResponse)(searchRes, body, (_d = (_c = itemRes === null || itemRes === void 0 ? void 0 : itemRes[0]) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.mentorship, (_f = (_e = itemRes === null || itemRes === void 0 ? void 0 : itemRes[1]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.mentorship);
        }
        else {
            searchResponse = (0, schema_build_helpers_1.buildSearchResponse)({ data: searchMentorShipReponse_json_1.default }, body);
        }
        return searchResponse;
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.searchMentorShipService = searchMentorShipService;
const selectMentorshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectRequest = (0, schema_build_helpers_1.buildSelectRequest)(body);
        console.log(JSON.stringify(selectRequest === null || selectRequest === void 0 ? void 0 : selectRequest.payload));
        let selectResponse = {};
        if (mentorshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/select`, selectRequest.payload, { headers });
            selectResponse = (0, schema_build_helpers_1.buildSelectResponse)(res, body);
        }
        else {
            selectResponse = (0, schema_build_helpers_1.buildSelectResponse)({ data: selectMentorShipResponse_json_1.default }, body);
        }
        return selectResponse;
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.selectMentorshipService = selectMentorshipService;
const confirmMentorshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const confirmRequest = (0, schema_build_helpers_1.buildConfirmRequest)(body);
        console.log(JSON.stringify(confirmRequest === null || confirmRequest === void 0 ? void 0 : confirmRequest.payload));
        let confirmResponse = {};
        if (mentorshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/confirm`, confirmRequest.payload, { headers });
            confirmResponse = (0, schema_build_helpers_1.buildConfirmResponse)(res, body);
        }
        else {
            confirmResponse = (0, schema_build_helpers_1.buildConfirmResponse)({ data: confirmMentorShipResponse_json_1.default }, body);
        }
        return confirmResponse;
    }
    catch (error) {
        console.log(error);
        return { error: error, errorOccured: true };
    }
});
exports.confirmMentorshipService = confirmMentorshipService;
const initMentorshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const initRequest = (0, schema_build_helpers_1.buildInitRequest)(body);
        console.log(JSON.stringify(initRequest === null || initRequest === void 0 ? void 0 : initRequest.payload));
        let initResponse = {};
        if (mentorshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/init`, initRequest.payload, {
                headers
            });
            initResponse = (0, schema_build_helpers_1.buildInitResponse)(res, body);
        }
        else {
            initResponse = (0, schema_build_helpers_1.buildInitResponse)({ data: initMentorShipResponse_json_1.default }, body);
        }
        return initResponse;
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.initMentorshipService = initMentorshipService;
const statusMentorshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statusRequest = (0, schema_build_helpers_1.buildStatusRequest)(body);
        console.log(JSON.stringify(statusRequest === null || statusRequest === void 0 ? void 0 : statusRequest.payload));
        let statusResponse = {};
        if (mentorshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/status`, statusRequest.payload, { headers });
            statusResponse = (0, schema_build_helpers_1.buildStatusResponse)(res, body);
        }
        else {
            statusResponse = (0, schema_build_helpers_1.buildStatusResponse)({ data: statusMentorShipResponse_json_1.default }, body);
        }
        return statusResponse;
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.statusMentorshipService = statusMentorshipService;
const cancelMentorshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cancelRequest = (0, schema_build_helpers_1.buildCancelRequest)(body);
        console.log(JSON.stringify(cancelRequest));
        let cancelResponse = {};
        if (mentorshipNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios.post(`${gatewayUrl}/cancel`, cancelRequest.payload, { headers });
            cancelResponse = (0, schema_build_helpers_1.buildCancelResponse)(res === null || res === void 0 ? void 0 : res.data, body);
        }
        else {
            cancelResponse = (0, schema_build_helpers_1.buildCancelResponse)(cancelMentorShipResponse_json_1.default, body);
        }
        return { data: cancelResponse };
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.cancelMentorshipService = cancelMentorshipService;

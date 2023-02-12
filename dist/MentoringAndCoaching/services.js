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
const searchMentorShipReponse_json_1 = __importDefault(require("./mocks/searchMentorShipReponse.json"));
const selectMentorShipResponse_json_1 = __importDefault(require("./mocks/selectMentorShipResponse.json"));
const confirmMentorShipResponse_json_1 = __importDefault(require("./mocks/confirmMentorShipResponse.json"));
const gatewayUrl = "https://dev.elevate-apis.shikshalokam.org/bpp";
const jobNetwork = process.env.JOB_NETWORK;
const searchMentorShipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchRequest = (0, schema_build_helpers_1.buildSearchRequest)(body);
        let searchResponse = {};
        if (jobNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios_1.default.post(`${gatewayUrl}/search`, searchRequest.payload, { headers });
            searchResponse = (0, schema_build_helpers_1.buildSearchResponse)(res === null || res === void 0 ? void 0 : res.data, body);
        }
        else {
            searchResponse = (0, schema_build_helpers_1.buildSearchResponse)(searchMentorShipReponse_json_1.default, body);
        }
        return { data: searchResponse };
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.searchMentorShipService = searchMentorShipService;
const selectMentorshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectRequest = (0, schema_build_helpers_1.buildSelectRequest)(body);
        let selectResponse = {};
        if (jobNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios_1.default.post(`${gatewayUrl}/select`, selectRequest.payload, { headers });
            selectResponse = (0, schema_build_helpers_1.buildSelectResponse)(res === null || res === void 0 ? void 0 : res.data, body);
        }
        else {
            selectResponse = (0, schema_build_helpers_1.buildSelectResponse)(selectMentorShipResponse_json_1.default, body);
        }
        return { data: selectResponse };
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.selectMentorshipService = selectMentorshipService;
const confirmMentorshipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const confirmRequest = (0, schema_build_helpers_1.buildConfirmRequest)(body);
        let confirmResponse = {};
        if (jobNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios_1.default.post(`${gatewayUrl}/confirm`, confirmRequest.payload, { headers });
            confirmResponse = (0, schema_build_helpers_1.buildConfirmResponse)(res === null || res === void 0 ? void 0 : res.data, body);
        }
        else {
            confirmResponse = (0, schema_build_helpers_1.buildConfirmResponse)(confirmMentorShipResponse_json_1.default, body);
        }
        return { data: confirmResponse };
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.confirmMentorshipService = confirmMentorshipService;
const initMentorshipService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectRequest = (0, schema_build_helpers_1.buildSelectRequest)();
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.initMentorshipService = initMentorshipService;
const statusMentorshipService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectRequest = (0, schema_build_helpers_1.buildSelectRequest)();
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.statusMentorshipService = statusMentorshipService;
const cancelMentorshipService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectRequest = (0, schema_build_helpers_1.buildSelectRequest)();
    }
    catch (error) {
        return { error: error, errorOccured: true };
    }
});
exports.cancelMentorshipService = cancelMentorshipService;

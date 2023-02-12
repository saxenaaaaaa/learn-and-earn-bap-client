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
exports.searchMentorShipService = void 0;
const schema_build_helpers_1 = require("./schema-build-helpers");
const axios_1 = __importDefault(require("axios"));
const searchMentorShipReponse_json_1 = __importDefault(require("./mocks/searchMentorShipReponse.json"));
const gatewayUrl = process.env.GATEWAY_URL || "";
const jobNetwork = process.env.JOB_NETWORK;
const searchMentorShipService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchRequest = (0, schema_build_helpers_1.buildSearchRequest)(body);
        let searchResponse = {};
        if (jobNetwork !== "local") {
            const headers = { "Content-Type": "application/JSON" };
            let res = yield axios_1.default.post(`${gatewayUrl}/mentor/search`, searchRequest.payload, { headers });
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

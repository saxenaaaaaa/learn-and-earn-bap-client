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
exports.initJob = exports.selectJob = exports.searchJob = exports.getJobConfirm = exports.getJobOnSearch = void 0;
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("../helper");
const dotenv_1 = __importDefault(require("dotenv"));
const schema_helper_1 = require("./schema_helper");
dotenv_1.default.config();
const gatewayUrl = process.env.GATEWAY_URL || "";
function getJobOnSearch(postBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = (0, helper_1.contextOnSearch)('jobs', 'on_search', postBody.transaction_id, postBody.message_id);
            const jobSchemaConstructer = {
                context,
                message: {},
            };
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post(`${gatewayUrl}/on_search`, jobSchemaConstructer, config);
            return bppResp.data;
        }
        catch (error) {
            return {
                error: error,
                errorOccured: true,
            };
        }
    });
}
exports.getJobOnSearch = getJobOnSearch;
function getJobConfirm(postBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = (0, helper_1.contextOnSearch)('jobs', 'on_search', postBody.transaction_id, postBody.message_id);
            const message = (0, schema_helper_1.confirmMessageBuilder)(postBody);
            const jobSchemaConstructer = {
                context,
                message
            };
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post(`${gatewayUrl}/confirm`, jobSchemaConstructer, config);
            return bppResp;
        }
        catch (error) {
            console.error(error);
            return {
                error: error,
                errorOccured: true,
            };
        }
    });
}
exports.getJobConfirm = getJobConfirm;
function searchJob(postBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = (0, helper_1.searchContextBuilder)("jobs", "search");
            const message = (0, schema_helper_1.searchJobMessageBuilder)(postBody);
            const jobSchemaConstructer = {
                context,
                message,
            };
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post(`${gatewayUrl}/search`, jobSchemaConstructer, config);
            return { context: { transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id }, network: bppResp.data, };
        }
        catch (error) {
            console.error(error);
            return {
                error: error,
                errorOccured: true,
            };
        }
    });
}
exports.searchJob = searchJob;
function selectJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = (0, helper_1.searchContextBuilder)("jobs", "search");
            const message = (0, schema_helper_1.selectJobMessageBuilder)(body);
            const jobSchemaConstructer = {
                context,
                message,
            };
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post(`${gatewayUrl}/select`, jobSchemaConstructer, config);
            return { network: bppResp.data, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
        }
        catch (error) {
            return {
                error: error,
                errorOccured: true,
            };
        }
    });
}
exports.selectJob = selectJob;
function initJob(body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = (0, helper_1.searchContextBuilder)("jobs", "search");
            const message = (0, schema_helper_1.initJobMessageBuilder)(body);
            const jobSchemaConstructer = {
                context,
                message,
            };
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post(`${gatewayUrl}/init`, jobSchemaConstructer, config);
            return { network: bppResp.data, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
        }
        catch (error) {
            return {
                error: error,
                errorOccured: true,
            };
        }
    });
}
exports.initJob = initJob;

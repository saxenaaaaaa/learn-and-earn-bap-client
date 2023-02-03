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
exports.searchJob = exports.getJobConfirm = exports.getJobOnSearch = void 0;
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("../helper");
const dotenv_1 = __importDefault(require("dotenv"));
const message_builder_1 = require("../helper/message-builder");
dotenv_1.default.config();
const gatewayUrl = process.env.GATEWAY_URL || "";
console.log(gatewayUrl, 'urlll');
function getJobOnSearch(postBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = (0, helper_1.contextOnSearch)('jobs', 'on_search', postBody.transaction_id, postBody.message_id);
            const jobSchemaConstructer = {
                context,
                message: {
                    intent: {
                        item: {
                            descriptor: {
                                name: postBody.title,
                            },
                        },
                    },
                },
            };
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post(gatewayUrl, jobSchemaConstructer, config);
            console.log(bppResp);
            bppResp = JSON.stringify(bppResp.data);
            console.log(bppResp);
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
exports.getJobOnSearch = getJobOnSearch;
function getJobConfirm(postBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jobSchemaConstructer = {
                context: {
                    domain: "dsep:" + postBody.category,
                    country: "IND",
                    city: "std:080",
                    action: "search",
                    core_version: "1.0.0",
                    bap_id: "dev.bap.faiz.protocol-server.com.dsep:jobs:BAP",
                    bap_uri: "localhost:3000/jobs/search",
                    bpp_id: "https://gateway.becknprotocol.io/bg/search",
                    bpp_uri: "localhost:3000/jobs/search",
                    transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62195",
                    message_id: "${{$randomUUID}}",
                    timestamp: Date.now(),
                },
                message: {
                    intent: {
                        item: {
                            descriptor: {
                                name: postBody.title,
                            },
                        },
                    },
                },
            };
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post(gatewayUrl, jobSchemaConstructer, config);
            bppResp = JSON.stringify(bppResp.data);
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
            const message = (0, message_builder_1.messageBuilder)(postBody.title);
            const jobSchemaConstructer = {
                context,
                message,
            };
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            console.log(JSON.stringify(jobSchemaConstructer));
            let bppResp = yield axios_1.default.post(gatewayUrl, jobSchemaConstructer, config);
            bppResp = JSON.stringify(bppResp.data);
            console.log(bppResp, 'bppresppp');
            return { bppResp, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
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

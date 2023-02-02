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
exports.getJob = exports.getJobConfirm = exports.getJobOnSearch = void 0;
const axios_1 = __importDefault(require("axios"));
const flatted_1 = require("flatted");
function getJobOnSearch(postBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jobSchemaConstructer = {
                context: {
                    domain: "dsep:" + postBody.category,
                    country: "IND",
                    city: "std:080",
                    action: "on_search",
                    core_version: "1.0.0",
                    bap_id: "dev.bap.faiz.protocol-server.com.dsep:jobs:BAP",
                    bap_uri: "localhost:3000/jobs/search",
                    transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62195",
                    message_id: "${{$randomUUID}}",
                    timestamp: "2022-10-11T09:55:41.161Z",
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
            let body = JSON.stringify(jobSchemaConstructer);
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post("http://localhost:5001/jobOnSearch", {
                body,
                config,
            });
            bppResp = (0, flatted_1.stringify)(bppResp);
            console.log("bpp ka repsonse hai yeh ---- ");
            console.log(bppResp);
            const jobs = {};
            // jobs["numberOfJobs"] = bppResp.message.catalog.fulfillments.length;
            // for (let i = 0; i < bppResp.message.catalog.providers.length; i++) {
            //   jobs["providers"].push(bppResp.message.catalog.providers.descriptor.name);
            // }
            // console.log(jobs);
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
                    transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62195",
                    message_id: "${{$randomUUID}}",
                    timestamp: "2022-10-11T09:55:41.161Z",
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
            let body = JSON.stringify(jobSchemaConstructer);
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post("http://localhost:5001/jobOnSearch", {
                body,
                config,
            });
            bppResp = (0, flatted_1.stringify)(bppResp);
            console.log("bpp ka repsonse hai yeh ---- ");
            console.log(bppResp.serverReply);
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
function getJob(postBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (postBody.onSearch == true) {
                return yield getJobOnSearch(postBody);
            }
            const jobSchemaConstructer = {
                context: {
                    domain: "dsep:" + postBody.category,
                    country: "IND",
                    city: "std:080",
                    action: "search",
                    core_version: "1.0.0",
                    bap_id: "dev.bap.faiz.protocol-server.com.dsep:jobs:BAP",
                    bap_uri: "localhost:3000/jobs/search",
                    transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62195",
                    message_id: "${{$randomUUID}}",
                    timestamp: "2022-10-11T09:55:41.161Z",
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
            let body = JSON.stringify(jobSchemaConstructer);
            const config = {
                headers: {
                    "Content-Type": "application/JSON",
                },
            };
            let bppResp = yield axios_1.default.post("http://localhost:5001/jobOnSearch", {
                body,
                config,
            });
            bppResp = (0, flatted_1.stringify)(bppResp);
            // console.log("bpp ka repsonse hai yeh ---- ");
            console.log(bppResp);
            const jobs = {};
            // jobs["numberOfJobs"] = bppResp.message.catalog.fulfillments.length;
            // for (let i = 0; i < bppResp.message.catalog.providers.length; i++) {
            //   jobs["providers"].push(bppResp.message.catalog.providers.descriptor.name);
            // }
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
exports.getJob = getJob;

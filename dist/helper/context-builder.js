"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextOnSearch = exports.searchContextBuilder = void 0;
const uuid_1 = require("uuid");
const searchContextBuilder = (category, action) => {
    return {
        domain: process.env.DOMAIN + category,
        country: process.env.COUNTRY || "",
        city: process.env.CITY || "",
        action: action,
        core_version: process.env.CORE_VERSION || "",
        bap_id: process.env.BAP_ID || "",
        bap_uri: process.env.BAP_URI || "",
        bpp_id: "",
        bpp_uri: "",
        transaction_id: (0, uuid_1.v4)(),
        message_id: (0, uuid_1.v4)(),
        timestamp: Date.now(),
    };
};
exports.searchContextBuilder = searchContextBuilder;
const contextOnSearch = (category, action, transaction_id, message_id) => {
    return {
        domain: process.env.DOMAIN + category,
        country: process.env.COUNTRY || "",
        city: process.env.CITY || "",
        action: action,
        core_version: process.env.CORE_VERSION || "",
        bap_id: process.env.BAP_ID || "",
        bap_uri: process.env.BAP_URI || "",
        bpp_id: "",
        bpp_uri: "",
        transaction_id: transaction_id,
        message_id: message_id,
        timestamp: Date.now(),
    };
};
exports.contextOnSearch = contextOnSearch;

import { randomUUID } from "crypto"
import { v4 as uuid } from "uuid"
export const searchContextBuilder = (category: any, action: any) => {
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
        transaction_id: uuid(),
        message_id: uuid(),
        timestamp: Date.now(),
    }
}

export const contextOnSearch = (category: any, action: any, transaction_id: any, message_id: any) => {
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
    }
}

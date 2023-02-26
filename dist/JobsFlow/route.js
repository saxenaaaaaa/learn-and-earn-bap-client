"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRoutes = void 0;
const express_1 = __importDefault(require("express"));
const jobController = __importStar(require("./controller"));
const router = express_1.default.Router();
const jobRoutes = () => {
    router.post("/search", jobController.search);
    router.post("/on_search", jobController.onSearch);
    router.post("/select", jobController.select);
    router.post('/on_select', jobController.onSelect);
    router.post("/init", jobController.init);
    router.post("/on_init", jobController.onInit);
    router.post("/confirm", jobController.confirm);
    router.post("/on_confirm", jobController.onConfirm);
    router.post("/status", jobController.status);
    router.post("/on_status", jobController.onstatus);
    return router;
};
exports.jobRoutes = jobRoutes;

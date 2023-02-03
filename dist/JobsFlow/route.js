"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
const jobRoutes = () => {
    router.post("/search", controller_1.jobSearchController);
    router.post("/on_search", controller_1.jobOnSearchController);
    return router;
};
exports.jobRoutes = jobRoutes;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorshipRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
const mentorshipRoutes = () => {
    router.post("/search", controller_1.search);
    router.post("/select", controller_1.select);
    router.post("/init", controller_1.init);
    router.post("/confirm", controller_1.confirm);
    router.post("/status", controller_1.status);
    router.post("/cancel", controller_1.cancel);
    return router;
};
exports.mentorshipRoutes = mentorshipRoutes;

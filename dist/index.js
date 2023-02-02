"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const controller_1 = require("./JobsFlow/controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.urlencoded()); // To parse URL-encoded bodies
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("dsep unified bap client is working");
});
const router = express_1.default.Router();
app.use(router);
app.use(express_1.default.json());
app.use("/jobs/search", controller_1.jobSearchController);
app.use("/jobs/onSearch", controller_1.jobOnSearchController);
app.use("/jobs/confirmSearch", controller_1.jobConfirmController);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const JobsFlow_1 = require("./JobsFlow");
const MentoringAndCoaching_1 = require("./MentoringAndCoaching");
const route_1 = require("./ScholarshipsAndGrants/route");
const route_2 = require("./TrainingAndCourses/route");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.urlencoded()); // To parse URL-encoded bodies
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("dsep unified bap client is working");
});
const router = express_1.default.Router();
app.use(router);
app.use(express_1.default.json());
app.use("/job", (0, JobsFlow_1.jobRoutes)());
app.use("/mentorship", (0, MentoringAndCoaching_1.mentorshipRoutes)());
app.use("/scholarship", (0, route_1.scholarshipsRoutes)());
app.use("/mentorship", (0, MentoringAndCoaching_1.mentorshipRoutes)());
app.use("/course", (0, route_2.trainingRoutes)());
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

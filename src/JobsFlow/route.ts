import express, { Router } from "express";
import { jobOnSearchController, jobSearchController } from "./controller";
const router: Router = express.Router();



export const jobRoutes = () => {
    router.post("/search", jobSearchController);
    router.post("/on_search", jobOnSearchController);
    return router
}










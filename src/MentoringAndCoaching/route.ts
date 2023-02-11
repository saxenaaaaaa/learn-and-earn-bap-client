import express, { Router } from "express";

import { search, select, init, confirm, status, cancel } from "./controller";

const router: Router = express.Router();

export const mentorshipRoutes = () => {
  router.post("/search", search);
  router.post("/select", select);
  router.post("/init", init);
  router.post("/confirm", confirm);
  router.post("/status", status);
  router.post("/cancel", cancel);

  return router;
};

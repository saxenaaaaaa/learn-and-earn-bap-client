import express, { Router } from "express";
import { search, init, confirm, status } from "./controller";
const router: Router = express.Router();

export const scholarshipsRoutes = () => {
  router.post("/search", search);
  router.post("/init", init);
  router.post("/confirm", confirm);
  router.post("/status", status);
  return router;
};

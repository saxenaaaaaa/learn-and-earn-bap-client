import express, { Response, Request } from "express";
import { getJob, getJobConfirm, getJobOnSearch } from "./services";
const router = express.Router();

export const jobSearchController = async (req: Request, res: Response) => {
  let resp;
  resp = await getJob(req.body);

  res.json(resp);
};

export const jobOnSearchController = async (req: Request, res: Response) => {
  let resp;
  resp = await getJobOnSearch(req.body);

  res.json(resp);
};

export const jobConfirmController = async (req: Request, res: Response) => {
  let resp;
  resp = await getJobConfirm(req.body);

  res.json(resp);
};

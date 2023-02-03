import express, { Response, Request } from "express";
import { searchJob, getJobConfirm, getJobOnSearch } from "./services";
const router = express.Router();

export const jobSearchController = async (req: Request, res: Response) => {

  const body = req.body
  const resp = await searchJob(req.body);
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



// title: ["Tester", "UI Testing"],
// company: ["Tata", "Google"],
// city: ["Pune", "Delhi"],
// skills: ["flutter", "kotlin", "architecture"]
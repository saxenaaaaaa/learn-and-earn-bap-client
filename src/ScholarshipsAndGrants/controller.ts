import express, { Request, Response } from "express";
import {
  searchScholarshipService,
  statusScholarshipService,
  confirmScholarshipService,
  initScholarshipService,
  selectScholarshipService
} from "./services";
export const search = async (req: Request, res: Response) => {
  const { data, status = 200 } = await searchScholarshipService(req.body);
  return res.status(status).json(data);
};

export const select = async (req: Request, res: Response) => {
  const { data, status = 200 } = await selectScholarshipService(req?.body);
  return res.status(status).json(data);
};

export const init = async (req: Request, res: Response) => {
  const { data, status = 200 } = await initScholarshipService(req.body);
  return res.status(status).json(data);
};

export const confirm = async (req: Request, res: Response) => {
  const { data, status = 200 } = await confirmScholarshipService(req.body);
  return res.status(status).json(data);
};
export const status = async (req: Request, res: Response) => {
  const { data, status = 200 } = await statusScholarshipService(req.body);
  return res.status(status).json(data);
};

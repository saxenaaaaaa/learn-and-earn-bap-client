import express, { Request, Response } from "express";
import {
  searchTrainingService,
  statusTrainingService,
  selectTrainingService,
  initTrainingService,
  confirmTrainingService
} from "./services";
export const search = async (req: Request, res: Response) => {
  const { data, status = 200 } = await searchTrainingService(req.body);
  return res.status(status).json(data);
};

export const init = async (req: Request, res: Response) => {
  const { data, status = 200 } = await initTrainingService(req.body);
  return res.status(status).json(data);
};

export const confirm = async (req: Request, res: Response) => {
  const { data, status = 200 } = await confirmTrainingService(req.body);
  return res.status(status).json(data);
};
export const status = async (req: Request, res: Response) => {
  const { data, status = 200 } = await statusTrainingService(req.body);
  return res.status(status).json(data);
};
export const select = async (req: Request, res: Response) => {
  const { data, status = 200 } = await selectTrainingService(req.body);
  return res.status(status).json(data);
};

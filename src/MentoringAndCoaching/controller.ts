import { Request, Response } from "express";
import {
  searchMentorShipService,
  selectMentorshipService,
  confirmMentorshipService,
  statusMentorshipService,
  cancelMentorshipService,
  initMentorshipService
} from "./services";

export const search = async (req: Request, res: Response) => {
  const { data, status = 200 } = await searchMentorShipService(req.body);

  return res.status(status).json(data);
};

export const select = async (req: Request, res: Response) => {
  const { data, status = 200 } = await selectMentorshipService(req.body);

  return res.status(status).json(data);
};

export const confirm = async (req: Request, res: Response) => {
  const { data, status = 200 } = await confirmMentorshipService(req.body);

  return res.status(status).json(data);
};

export const status = async (req: Request, res: Response) => {
  const { data, status = 200 } = await statusMentorshipService(req.body);

  return res.status(status).json(data);
};

export const cancel = async (req: Request, res: Response) => {
  const { data, status = 200 } = await cancelMentorshipService(req.body);

  return res.status(status).json(data);
};

export const init = async (req: Request, res: Response) => {
  const { data, status = 200 } = await initMentorshipService(req.body);

  return res.status(status).json(data);
};

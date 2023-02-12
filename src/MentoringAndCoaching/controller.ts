import { Request, Response } from "express";
import { searchMentorShipService } from "./services";

export const search = async (req: Request, res: Response) => {
  const { data, status = 200 } = await searchMentorShipService(req.body);

  return res.status(status).json(data);
};

export const select = async (req: Request, res: Response) => {};

export const init = async (req: Request, res: Response) => {};

export const confirm = async (req: Request, res: Response) => {};

export const status = async (req: Request, res: Response) => {};

export const cancel = async (req: Request, res: Response) => {};

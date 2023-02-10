import { Response, Request } from "express";
import { confirmJob, initJob, onConfirmJob, onInitJob, onSearchJob, onSelectJob, searchJob, selectJob } from "./services";

export const search = async (req: Request, res: Response) => {
  const resp = await searchJob(req.body);
  res.json(resp);
};

export const onSearch = async (req: Request, res: Response) => {
  const body = req.body
  const resp = await onSearchJob(body);
  res.json(resp);
};

export const select = async (req: Request, res: Response) => {
  const resp = await selectJob(req.body);
  res.json(resp);
}

export const onSelect = async (req: Request, res: Response) => {
  const resp = await onSelectJob(req.body);
  res.json(resp);
}

export const init = async (req: Request, res: Response) => {
  const resp = await initJob(req.body)
  res.json(resp)
}

export const onInit = async (req: Request, res: Response) => {
  const resp = await onInitJob(req.body)
  res.json(resp)
}

export const confirm = async (req: Request, res: Response) => {
  const resp = await confirmJob(req.body);
  res.json(resp);
};


export const onConfirm = async (req: Request, res: Response) => {
  const resp = await onConfirmJob(req.body);
  res.json(resp);
}

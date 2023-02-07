import { Response, Request } from "express";
import { searchJob, getJobConfirm, getJobOnSearch, selectJob, initJob, onInitJob } from "./services";

export const search = async (req: Request, res: Response) => {
  const resp = await searchJob(req.body);
  res.json(resp);
};

export const onSearch = async (req: Request, res: Response) => {
  const body = req.body
  const resp = await getJobOnSearch(body);
  res.json(resp);
};

export const select = async (req: Request, res: Response) => {
  const resp = await selectJob(req.body);
  res.json(resp);
}

export const init = async (req: Request, res: Response) => {
  const resp = await initJob(req.body)
  res.json(resp)
}

export const confirm = async (req: Request, res: Response) => {
  let resp;
  resp = await getJobConfirm(req.body);
  res.json(resp);
};

export const onSelect = async (req: Request, res: Response) => {
  let body = req.body
  res.json("res from on select")
}

export const onInit = async (req: Request, res: Response) => {
  let body = req.body
  onInitJob(body)
  res.json("res from on Init")
}

export const onConfirm = async (req: Request, res: Response) => {
  let body = req.body
  res.json("res from on confirm ")
}

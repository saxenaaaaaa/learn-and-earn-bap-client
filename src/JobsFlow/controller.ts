import { Response, Request } from "express";
import { getJob } from "./services";

export const jobSearchController = async (req: Request, res: Response) => {
  const response = await getJob(req.body);
  console.log(">>Res from protocol server is::\n", response);
  res.send(response);
};

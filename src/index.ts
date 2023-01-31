import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { jobSearchController } from "./JobsFlow/controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("dsep unified bap client is working");
});

const router = express.Router();
app.use(router);
app.use(express.json());
app.use("/jobs", jobSearchController);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

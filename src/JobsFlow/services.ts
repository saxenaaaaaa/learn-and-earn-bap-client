import axios from "axios";
import { parse } from "dotenv";
import { response } from "express";
import { stringify } from "flatted";

export async function getJobOnSearch(body: any): Promise<any> {
  try {
    let bppResp: any = await axios.post(
      "http://localhost:5001/jobOnSearch",
      body
    );
    bppResp = stringify(bppResp);
    return bppResp;
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function getJobConfirm(body: any): Promise<any> {
  try {
    let result: any = await axios.post(
      "http://localhost:5001/jobConfirm",
      body
    );
    result = stringify(result);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function getJob(body: any): Promise<any> {
  try {
    let result: any = await axios.post("http://localhost:5001/jobSearch", body);
    result = stringify(result);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

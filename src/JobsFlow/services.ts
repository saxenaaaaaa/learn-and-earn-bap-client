import axios from "axios";
import { parse } from "dotenv";
import { response } from "express";
import { stringify } from "flatted";
import { JobContextDTO, JobRequestDto } from "./schema";
import { searchContextBuilder, contextOnSearch } from "../helper";
import dotenv from "dotenv";
import { messageBuilder } from "../helper/message-builder";

dotenv.config();
const gatewayUrl = process.env.GATEWAY_URL || "";
console.log(gatewayUrl, 'urlll')
export async function getJobOnSearch(postBody: any): Promise<any> {
  try {
    const context = contextOnSearch('jobs', 'on_search', postBody.transaction_id, postBody.message_id)
    const jobSchemaConstructer: JobRequestDto = {
      context,
      message: {
        intent: {
          item: {
            descriptor: {
              name: postBody.title,
            },
          },
        },
      },
    };

    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };
    let bppResp: any = await axios.post(gatewayUrl, jobSchemaConstructer, config);
    console.log(bppResp)
    bppResp = JSON.stringify(bppResp.data);
    console.log(bppResp)
    return bppResp;
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function getJobConfirm(postBody: any): Promise<any> {
  try {
    const jobSchemaConstructer: JobRequestDto = {
      context: {
        domain: "dsep:" + postBody.category,
        country: "IND",
        city: "std:080",
        action: "search",
        core_version: "1.0.0",
        bap_id: "dev.bap.faiz.protocol-server.com.dsep:jobs:BAP",
        bap_uri: "localhost:3000/jobs/search",
        bpp_id: "https://gateway.becknprotocol.io/bg/search",
        bpp_uri: "localhost:3000/jobs/search",
        transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62195",
        message_id: "${{$randomUUID}}",
        timestamp: Date.now(),
      },
      message: {
        intent: {
          item: {
            descriptor: {
              name: postBody.title,
            },
          },
        },
      },
    };

    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };
    let bppResp: any = await axios.post(gatewayUrl, jobSchemaConstructer, config);
    bppResp = JSON.stringify(bppResp.data);
    return bppResp;
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function searchJob(postBody: any): Promise<any> {
  try {
    const context = searchContextBuilder("jobs", "search")
    const message = messageBuilder(postBody.title)
    const jobSchemaConstructer: any = {
      context,
      message,
    };
    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };
    console.log(JSON.stringify(jobSchemaConstructer))
    let bppResp: any = await axios.post(gatewayUrl, jobSchemaConstructer, config);
    bppResp = JSON.stringify(bppResp.data);
    console.log(bppResp, 'bppresppp')
    return { bppResp, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

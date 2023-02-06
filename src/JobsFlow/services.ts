import axios from "axios";
import { searchContextBuilder, contextOnSearch } from "../helper";
import dotenv from "dotenv";
import { searchJobMessageBuilder, selectJobMessageBuilder, initJobMessageBuilder, confirmMessageBuilder, onSearchResponseBuilder, selectRequestBuilder, buildSelectRequest } from "./schema_helper";

dotenv.config();
const gatewayUrl = process.env.GATEWAY_URL || "";
export async function getJobOnSearch(postBody: any): Promise<any> {
  try {
    const context = contextOnSearch('jobs', 'on_search', postBody.transaction_id, postBody.message_id)
    const jobSchemaConstructer = {
      context,
      message: {},
    };

    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };
    let bppResp: any = await axios.post(`${gatewayUrl}/on_search`, jobSchemaConstructer, config);
    return bppResp.data;
  } catch (error) {
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function getJobConfirm(postBody: any): Promise<any> {
  try {
    const context = contextOnSearch('jobs', 'on_search', postBody.transaction_id, postBody.message_id)
    const message = confirmMessageBuilder(postBody)
    const jobSchemaConstructer = {
      context,
      message
    };

    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };
    let bppResp: any = await axios.post(`${gatewayUrl}/confirm`, jobSchemaConstructer, config);
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
    const message = searchJobMessageBuilder(postBody)
    const jobSchemaConstructer: any = {
      context,
      message,
    };
    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post(`${gatewayUrl}/search`, jobSchemaConstructer, config);
    return { context: { transaction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id }, network: bppResp.data, };
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function selectJob(body: any) {
  try {
    const requestBody = buildSelectRequest(body);
    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post(`${gatewayUrl}/select`, requestBody, config);
    return { network: bppResp.data, context: body?.context };
  }
  catch (error) {
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function initJob(body: any) {
  try {
    const context = searchContextBuilder("jobs", "search")
    const message = initJobMessageBuilder(body)

    const jobSchemaConstructer: any = {
      context,
      message,
    };
    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post(`${gatewayUrl}/init`, jobSchemaConstructer, config);
    return { network: bppResp.data, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
  }
  catch (error) {
    return {
      error: error,
      errorOccured: true,
    };
  }
}

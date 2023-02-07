import axios from "axios";
import { searchContextBuilder, contextOnSearch } from "../helper";
import dotenv from "dotenv";
import { searchJobMessageBuilder, selectJobMessageBuilder, initJobMessageBuilder, confirmMessageBuilder, OnInitJobMessageBuilder, OnSelectJobMessageBuilder, OnConfirmJobMessageBuilder } from "./schema_helper";

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
    const context = contextOnSearch('jobs', 'confirm', postBody.transaction_id, postBody.message_id)
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
    return { context: { transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id }, network: bppResp.data, };
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
    const context = searchContextBuilder("jobs", "select")
    const message = selectJobMessageBuilder(body)

    const jobSchemaConstructer: any = {
      context,
      message,
    };
    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post(`${gatewayUrl}/select`, jobSchemaConstructer, config);
    return { network: bppResp.data, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
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
    const context = searchContextBuilder("jobs", "init")
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

export async function onInitJob(body: any) {
  try {
    const context = searchContextBuilder("jobs", "on_init")
    const message = OnInitJobMessageBuilder(body)

    const jobSchemaConstructer: any = {
      context,
      message,
    };
    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post(`${gatewayUrl}/on_init`, jobSchemaConstructer, config);
    return { network: bppResp.data, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
  }
  catch (error) {
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function onSelectJob(body: any) {
  try {
    const context = searchContextBuilder("jobs", "on_select")
    const message = OnSelectJobMessageBuilder(body)

    const jobSchemaConstructer: any = {
      context,
      message,
    };
    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post(`${gatewayUrl}/on_select`, jobSchemaConstructer, config);
    return { network: bppResp.data, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
  }
  catch (error) {
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function onConfirmJob(body: any) {
  try {
    const context = searchContextBuilder("jobs", "on_confirm")
    const message = OnConfirmJobMessageBuilder(body)

    const jobSchemaConstructer: any = {
      context,
      message,
    };
    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post(`${gatewayUrl}/on_confirm`, jobSchemaConstructer, config);
    return { network: bppResp.data, transiction_id: jobSchemaConstructer.context.transaction_id, message_id: jobSchemaConstructer.context.message_id };
  }
  catch (error) {
    return {
      error: error,
      errorOccured: true,
    };
  }
}

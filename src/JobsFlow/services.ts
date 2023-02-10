import axios from "axios";
import dotenv from "dotenv";
import {
  buildSelectRequest,
  buildOnSearchResponse,
  buildSearchResponse,
  buildOnSearchRequest,
  buildSelectResponse,
  buildOnSelectRequest,
  buildOnSelectResponse,
  buildConfirmRequest,
  buildConfirmResponse,
  buildInitRequest,
  buildOnInitRequest,
  buildSearchRequest,
  buildOnConfirmRequest,
  buildInitResponse,
  buildOnInitResponse,
  buildOnConfirmResponse
} from "./schema_helper";

dotenv.config();
const gatewayUrl = process.env.GATEWAY_URL || "";

export async function searchJob(body: any): Promise<any> {
  try {
    const { payload } = buildSearchRequest(body);
    const headers = { "Content-Type": "application/JSON" };

    let response: any = await axios.post(`${gatewayUrl}/search`, payload, { headers });
    return buildSearchResponse(response?.data, body);
  } catch (error) {
    return { error: error, errorOccured: true };
  }
}

export async function onSearchJob(body: any): Promise<any> {
  try {
    const { payload } = buildOnSearchRequest(body);
    const headers = { "Content-Type": "application/JSON" };

    let response: any = await axios.post(`${gatewayUrl}/on_search`, payload, { headers });
    return buildOnSearchResponse(response?.data, body);
  } catch (error) {
    return { error: error, errorOccured: true };
  }
}

export async function selectJob(body: any): Promise<any> {
  try {
    const { payload } = buildSelectRequest(body)
    const headers = { "Content-Type": "application/JSON" };

    let response: any = await axios.post(`${gatewayUrl}/search`, payload, { headers });
    return buildSelectResponse(response?.data, body);
  } catch (error) {
    return { error: error, errorOccured: true };
  }
}

export async function onSelectJob(body: any) {
  try {
    const { payload } = buildOnSelectRequest(body);
    const headers = { "Content-Type": "application/JSON" };

    let response: any = await axios.post(`${gatewayUrl}/on_select`, payload, { headers });
    return buildOnSelectResponse(response?.data, body);
  }
  catch (error) {
    return { error: error, errorOccured: true, };
  }
}

export async function initJob(body: any) {
  try {
    const { payload } = buildInitRequest();
    const headers = { "Content-Type": "application/JSON" };

    let response: any = await axios.post(`${gatewayUrl}/init`, payload, { headers });
    return buildInitResponse(response?.data);
  }
  catch (error) {
    return { error: error, errorOccured: true };
  }
}

export async function onInitJob(body: any) {
  try {
    const { payload } = buildOnInitRequest(body);
    const headers = { "Content-Type": "application/JSON" };

    let response: any = await axios.post(`${gatewayUrl}/on_init`, payload, { headers });
    return buildOnInitResponse(response?.data);
  }
  catch (error) {
    return { error: error, errorOccured: true };
  }
}

export async function confirmJob(body: any): Promise<any> {
  try {
    const { payload } = buildConfirmRequest(body);
    const headers = { "Content-Type": "application/JSON" };

    let response: any = await axios.post(`${gatewayUrl}/confirm`, payload, { headers });
    return buildConfirmResponse(response?.data);
  } catch (error) {
    return { error: error, errorOccured: true };
  }
}

export async function onConfirmJob(body: any) {
  try {
    const { payload } = buildOnConfirmRequest(body);
    const headers = { "Content-Type": "application/JSON" };

    let response: any = await axios.post(`${gatewayUrl}/on_confirm`, payload, { headers });
    return buildOnConfirmResponse(response.data);
  }
  catch (error) {
    return { error: error, errorOccured: true };
  }
}

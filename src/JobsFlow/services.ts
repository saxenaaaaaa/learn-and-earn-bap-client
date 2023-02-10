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
import onSelectResponse from './mock/onSelectResponse.json'
import onSearchResponse from './mock/onSearchResponse.json'
import onInitResponse from './mock/onInitResponse.json'
import onConfirmResponse from './mock/onConfirmResponse.json'
import { json } from "stream/consumers";
dotenv.config();
const gatewayUrl = process.env.GATEWAY_URL || "";
const localNetwork = process.env.JOB_NETWORK

export async function searchJob(body: any): Promise<any> {
  try {
    const { payload } = buildSearchRequest(body);
    console.log(JSON.stringify(payload))

    let response = onSearchResponse;
    if (localNetwork != 'local') {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(`${gatewayUrl}/search`, payload, { headers });
      response = res?.data
    }
    return buildSearchResponse(response, body);
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
    const { payload } = buildSelectRequest(body);
    console.log(JSON.stringify(payload))
    let response = onSelectResponse;
    if (localNetwork != 'local') {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(`${gatewayUrl}/select`, payload, { headers });
      response = res?.data
    }
    return buildSelectResponse(response, body);
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
    const { payload } = buildInitRequest(body);
    console.log(JSON.stringify(payload))

    let response = onInitResponse;
    if (localNetwork != 'local') {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(`${gatewayUrl}/init`, payload, { headers });
      response = res.data
    }
    return buildInitResponse(response);
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
    console.log('aiia')
    const { payload } = buildConfirmRequest(body);
    console.log(JSON.stringify(payload))
    let response = onConfirmResponse;
    if (localNetwork != 'local') {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(`${gatewayUrl}/confirm`, payload, { headers });
      response = res.data
    }
    return buildConfirmResponse(response);
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

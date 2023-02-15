import axios from "axios";
import {
  buildSearchRequest,
  buildSearchResponse,
  buildInitRequest,
  buildInitResponse,
  buildConfirmRequest,
  buildConfirmResponse,
  buildStatusRequest,
  buildStatusResponse,
  buildSelectRequest,
  buildSelectResponse
} from "./schema-build-helper";
import searchTrainingResponse from "./mocks/searchTrainingResponse.json";
import initTrainingResponse from "./mocks/initTrainingResponse.json";
import confirmTrainingResponse from "./mocks/confirmTrainingResponse.json";
import statusTrainingResponse from "./mocks/statusTrainingResponse.json";

const gatewayUrl = "https://api.examplebap.io/v0/";
const trainingNetwork = process.env.TRAINING_NETWORK;

export const searchTrainingService = async (body: any): Promise<any> => {
  try {
    const searchRequest = buildSearchRequest(body);
    console.log(JSON.stringify(searchRequest.payload));

    let searchResponse: any = {};
    if (trainingNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/search`,
        searchRequest.payload,
        { headers }
      );
      searchResponse = buildSearchResponse(res?.data, body);
    } else {
      searchResponse = buildSearchResponse(searchTrainingResponse, body);
    }

    return { data: searchResponse };
  } catch (error) {
    console.log(error);
    return { error: error, errorOccured: true };
  }
};

export const initTrainingService = async (body: any): Promise<any> => {
  try {
    const initRequest = buildInitRequest(body);
    console.log(JSON.stringify(initRequest.payload));
    return { data: initRequest.payload };
    let initResponse: any = {};
    if (trainingNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(`${gatewayUrl}/search`, initRequest.payload, {
        headers
      });
      initResponse = buildInitResponse(res?.data, body);
    } else {
      initResponse = buildInitResponse(initTrainingResponse, body);
    }

    return { data: initResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const confirmTrainingService = async (body: any): Promise<any> => {
  try {
    const confirmRequest = buildConfirmRequest(body);
    console.log(JSON.stringify(confirmRequest.payload));

    let confirmResponse: any = {};
    if (trainingNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/search`,
        confirmRequest.payload,
        { headers }
      );
      confirmResponse = buildConfirmResponse(res?.data, body);
    } else {
      confirmResponse = buildConfirmResponse(confirmTrainingResponse, body);
    }

    return { data: confirmResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const statusTrainingService = async (body: any): Promise<any> => {
  try {
    const statusRequest = buildStatusRequest(body);
    console.log(JSON.stringify(statusRequest.payload));

    let statusResponse: any = {};
    if (trainingNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/search`,
        statusRequest.payload,
        { headers }
      );
      statusResponse = buildStatusResponse(res?.data, body);
    } else {
      statusResponse = buildStatusResponse(statusTrainingResponse, body);
    }

    return { data: statusResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const selectTrainingService = async (body: any): Promise<any> => {
  try {
    const statusRequest = buildSelectRequest(body);
    console.log(JSON.stringify(statusRequest.payload));

    let statusResponse: any = {};
    if (trainingNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/search`,
        statusRequest.payload,
        { headers }
      );
      statusResponse = buildSelectResponse(res?.data, body);
    } else {
      statusResponse = buildSelectResponse(statusTrainingResponse, body);
    }

    return { data: statusResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

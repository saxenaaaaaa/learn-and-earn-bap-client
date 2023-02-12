import {
  buildSearchRequest,
  buildSearchResponse,
  buildSelectRequest,
  buildSelectResponse,
  buildConfirmRequest,
  buildConfirmResponse,
  buildInitRequest,
  buildInitResponse,
  buildStatusRequest,
  buildStatusResponse
} from "./schema-build-helpers";
import axios from "axios";
import searchMentorShipResp from "./mocks/searchMentorShipReponse.json";
import selectMentorshipResp from "./mocks/selectMentorShipResponse.json";
import confirmMentorShipResponse from "./mocks/confirmMentorShipResponse.json";

const gatewayUrl = "https://dev.elevate-apis.shikshalokam.org/bpp";
const jobNetwork = process.env.JOB_NETWORK;

export const searchMentorShipService = async (body: any): Promise<any> => {
  try {
    const searchRequest = buildSearchRequest(body);
    let searchResponse: any = {};
    if (jobNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/search`,
        searchRequest.payload,
        { headers }
      );
      searchResponse = buildSearchResponse(res?.data, body);
    } else {
      searchResponse = buildSearchResponse(searchMentorShipResp, body);
    }

    return { data: searchResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const selectMentorshipService = async (body: any): Promise<any> => {
  try {
    const selectRequest = buildSelectRequest(body);
    let selectResponse: any = {};
    if (jobNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/select`,
        selectRequest.payload,
        { headers }
      );
      selectResponse = buildSelectResponse(res?.data, body);
    } else {
      selectResponse = buildSelectResponse(selectMentorshipResp, body);
    }
    return { data: selectResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const confirmMentorshipService = async (body: any): Promise<any> => {
  try {
    const confirmRequest = buildConfirmRequest(body);
    let confirmResponse: any = {};
    if (jobNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/confirm`,
        confirmRequest.payload,
        { headers }
      );
      confirmResponse = buildConfirmResponse(res?.data, body);
    } else {
      confirmResponse = buildConfirmResponse(confirmMentorShipResponse, body);
    }
    return { data: confirmResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const initMentorshipService = async (): Promise<any> => {
  try {
    const selectRequest = buildSelectRequest();
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const statusMentorshipService = async (): Promise<any> => {
  try {
    const selectRequest = buildSelectRequest();
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const cancelMentorshipService = async (): Promise<any> => {
  try {
    const selectRequest = buildSelectRequest();
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

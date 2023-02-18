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
  buildStatusResponse,
  buildCancelRequest,
  buildCancelResponse
} from "./schema-build-helpers";
import axiosInstance from "axios";
import https from "https";

import searchMentorShipResp from "./mocks/searchMentorShipReponse.json";
import selectMentorshipResp from "./mocks/selectMentorShipResponse.json";
import confirmMentorShipResponse from "./mocks/confirmMentorShipResponse.json";
import statusMentorShipResponse from "./mocks/statusMentorShipResponse.json";
import cancelMentorShipResponse from "./mocks/cancelMentorShipResponse.json";
import initMentorShipResponse from "./mocks/initMentorShipResponse.json";

const gatewayUrl = "https://dsep-protocol-client.becknprotocol.io";
const mentorshipNetwork = process.env.MENTORSHIP_NETWORK;
const axios = axiosInstance.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});
export const searchMentorShipService = async (body: any): Promise<any> => {
  try {
    const searchRequest = buildSearchRequest(body);
    console.log(JSON.stringify(searchRequest.payload));

    let searchResponse: any = {};
    if (mentorshipNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/search`,
        searchRequest.payload,
        { headers }
      );

      searchResponse = buildSearchResponse(res, body);
    } else {
      searchResponse = buildSearchResponse({ data: searchMentorShipResp }, body);
    }

    return searchResponse;
  } catch (error: any) {
    return { error: error, errorOccured: true };
  }
};

export const selectMentorshipService = async (body: any): Promise<any> => {
  try {
    const selectRequest = buildSelectRequest(body);
    console.log(JSON.stringify(selectRequest?.payload));

    let selectResponse: any = {};
    if (mentorshipNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/select`,
        selectRequest.payload,
        { headers }
      );
      selectResponse = buildSelectResponse(res, body);
    } else {
      selectResponse = buildSelectResponse({ data: selectMentorshipResp }, body);
    }
    return selectResponse;
  } catch (error: any) {
    return { error: error, errorOccured: true };
  }
};

export const confirmMentorshipService = async (body: any): Promise<any> => {
  try {
    const confirmRequest = buildConfirmRequest(body);
    console.log(JSON.stringify(confirmRequest?.payload));

    let confirmResponse: any = {};
    if (mentorshipNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/confirm`,
        confirmRequest.payload,
        { headers }
      );
      confirmResponse = buildConfirmResponse(res, body);
    } else {
      confirmResponse = buildConfirmResponse({ data: confirmMentorShipResponse }, body);
    }
    return confirmResponse;
  } catch (error) {
    console.log(error);
    return { error: error, errorOccured: true };
  }
};

export const initMentorshipService = async (body: any): Promise<any> => {
  try {
    const initRequest = buildInitRequest(body);
    console.log(JSON.stringify(initRequest?.payload));
    let initResponse: any = {};
    if (mentorshipNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(`${gatewayUrl}/init`, initRequest.payload, {
        headers
      });
      initResponse = buildInitResponse(res, body);
    } else {
      initResponse = buildInitResponse({ data: initMentorShipResponse }, body);
    }
    return initResponse;
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const statusMentorshipService = async (body: any): Promise<any> => {
  try {
    const statusRequest = buildStatusRequest(body);
    console.log(JSON.stringify(statusRequest?.payload));
    let statusResponse: any = {};
    if (mentorshipNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/status`,
        statusRequest.payload,
        { headers }
      );
      statusResponse = buildStatusResponse(res, body);
    } else {
      statusResponse = buildStatusResponse({ data: statusMentorShipResponse }, body);
    }

    return statusResponse;
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

export const cancelMentorshipService = async (body: any): Promise<any> => {
  try {
    const cancelRequest = buildCancelRequest(body);
    console.log(JSON.stringify(cancelRequest));

    let cancelResponse: any = {};

    if (mentorshipNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/cancel`,
        cancelRequest.payload,
        { headers }
      );
      cancelResponse = buildCancelResponse(res?.data, body);
    } else {
      cancelResponse = buildCancelResponse(cancelMentorShipResponse, body);
    }
    return { data: cancelResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

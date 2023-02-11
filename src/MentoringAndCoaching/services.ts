import {
  buildSearchRequest,
  buildSearchResponse
} from "./schema-build-helpers";
import axios from "axios";
import searchMentorShipResp from "./mocks/searchMentorShipReponse.json";

const gatewayUrl = process.env.GATEWAY_URL || "";
const jobNetwork = process.env.JOB_NETWORK;

export const searchMentorShipService = async (body: any): Promise<any> => {
  try {
    const searchRequest = await buildSearchRequest(body);
    let searchResponse: any = {};
    if (jobNetwork !== "local") {
      const headers = { "Content-Type": "application/JSON" };
      let res = await axios.post(
        `${gatewayUrl}/mentor/search`,
        searchRequest.payload,
        { headers }
      );
      searchResponse = res?.data;
    } else {
      searchResponse = await buildSearchResponse(searchMentorShipResp, body);
    }

    return { data: searchResponse };
  } catch (error) {
    return { error: error, errorOccured: true };
  }
};

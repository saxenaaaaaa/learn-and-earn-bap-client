import axios from "axios";
import { parse } from "dotenv";
import { response } from "express";
import { stringify } from "flatted";
import { JobContextDTO, JobRequestDto } from "./schema";

export async function getJobOnSearch(postBody: any): Promise<any> {
  try {
    const jobSchemaConstructer: JobRequestDto = {
      context: {
        domain: "dsep:" + postBody.category,
        country: "IND",
        city: "std:080",
        action: "on_search",
        core_version: "1.0.0",
        bap_id: "dev.bap.faiz.protocol-server.com.dsep:jobs:BAP",
        bap_uri: "localhost:3000/jobs/search",
        transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62195",
        message_id: "${{$randomUUID}}",
        timestamp: "2022-10-11T09:55:41.161Z",
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
    let body = JSON.stringify(jobSchemaConstructer);

    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };
    let bppResp: any = await axios.post("http://localhost:5001/jobOnSearch", {
      body,
      config,
    });
    bppResp = stringify(bppResp);
    console.log("bpp ka repsonse hai yeh ---- ");
    console.log(bppResp);

    const jobs: any = {};

    // jobs["numberOfJobs"] = bppResp.message.catalog.fulfillments.length;
    // for (let i = 0; i < bppResp.message.catalog.providers.length; i++) {
    //   jobs["providers"].push(bppResp.message.catalog.providers.descriptor.name);
    // }

    // console.log(jobs);

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
        transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62195",
        message_id: "${{$randomUUID}}",
        timestamp: "2022-10-11T09:55:41.161Z",
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
    let body = JSON.stringify(jobSchemaConstructer);

    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post("http://localhost:5001/jobOnSearch", {
      body,
      config,
    });
    bppResp = stringify(bppResp);
    console.log("bpp ka repsonse hai yeh ---- ");
    console.log(bppResp.serverReply);
    return bppResp;
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

export async function getJob(postBody: any): Promise<any> {
  try {
    if (postBody.onSearch == true) {
      return await getJobOnSearch(postBody);
    }

    const jobSchemaConstructer: JobRequestDto = {
      context: {
        domain: "dsep:" + postBody.category,
        country: "IND",
        city: "std:080",
        action: "search",
        core_version: "1.0.0",
        bap_id: "dev.bap.faiz.protocol-server.com.dsep:jobs:BAP",
        bap_uri: "localhost:3000/jobs/search",
        transaction_id: "a9aaecca-10b7-4d19-b640-b047a7c62195",
        message_id: "${{$randomUUID}}",
        timestamp: "2022-10-11T09:55:41.161Z",
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
    let body = JSON.stringify(jobSchemaConstructer);

    const config = {
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    let bppResp: any = await axios.post("http://localhost:5001/jobOnSearch", {
      body,
      config,
    });
    bppResp = stringify(bppResp);
    // console.log("bpp ka repsonse hai yeh ---- ");
    console.log(bppResp);

    const jobs: any = {};

    // jobs["numberOfJobs"] = bppResp.message.catalog.fulfillments.length;
    // for (let i = 0; i < bppResp.message.catalog.providers.length; i++) {
    //   jobs["providers"].push(bppResp.message.catalog.providers.descriptor.name);
    // }
    return bppResp;
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

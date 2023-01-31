import axios from "axios";
import { stringify } from "flatted";

export async function getJob(jobDTO: any): Promise<any> {
  try {
    let result: any = await axios.post(
      "http://localhost:5001/jobSearch",
      jobDTO
    );
    result = stringify(result);
    console.log(result["message"]);

    ///
    ///

    return result;
  } catch (error) {
    console.error(error);
    return {
      error: error,
      errorOccured: true,
    };
  }
}

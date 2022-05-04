import axios from "axios";
import config from "./config.json";
import { getGCOptions } from "../../common/utils/axios";
export const getSentiment = async (text: string) => {
  //curl "https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyCdtttQRLjLob_tO10rCkaWYOQtUQqRWlE" -s -X POST -H "Content-Type: application/json" --data-binary @request.json
  const options = getGCOptions({
    method: "POST",
    data: {
      document: {
        type: "PLAIN_TEXT",
        content: text,
      },
      encodingType: "UTF8",
    },
  });

  return axios(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${config.GC_API_KEY}`, options);
};

import axios from "axios";
import config from "./config.json";
import { getCSOptions } from "../../common/utils/axios";

export interface IDictionary {
  [key: string]: any;
}

export const getFieldsDictionary = async (contentTypeUid: string, data: any) => {
  let result: IDictionary = {};
  const options = getCSOptions({ method: "GET" });
  const cts = await axios(`${config.CS_API_HOST}/v3/content_types/${contentTypeUid}`, options);
  const fields = cts.data.content_type.schema as any[];
  fields.forEach((field: any) => {
    if (field.data_type === "text") {
      result[field.uid] = data[field.uid];
    } else if (field.data_type === "blocks") {
      const innerFields = field.blocks as any[];
      let i = 0;
      innerFields.forEach((innerField: any) => {
        const blockFields = innerField.schema as any[];

        blockFields.forEach((blockField: any) => {
          if (blockField.data_type === "text") {
            const key = `${field.uid}.${i}.${innerField.uid}.${blockField.uid}`;
            // console.log("key", key);
            // result[key] = data[field.uid][j][innerField.uid][blockField.uid];
            // console.log(innerField.uid, blockField.uid);
            if (
              data[field.uid][i] &&
              data[field.uid][i][innerField.uid] &&
              data[field.uid][i][innerField.uid][blockField.uid]
            ) {
              result[key] = data[field.uid][i][innerField.uid][blockField.uid];
            }
          }
        });
        i++;
      });
    }
  });
  return result;
};

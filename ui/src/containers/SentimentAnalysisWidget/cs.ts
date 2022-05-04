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
    } else if (field.data_type === "blocks" || field.data_type === "group") {
      const innerFields = field.data_type === "blocks" ? (field.blocks as any[]) : [field];
      let i = 0;

      innerFields.forEach((innerField: any) => {
        const blockOrGroupFields = innerField.schema as any[];

        blockOrGroupFields.forEach((blockOrGroupField: any) => {
          console.log(blockOrGroupField.data_type);
          if (blockOrGroupField.data_type === "text") {
            const indexPortion = field.data_type === "blocks" ? `.${i}.` : ".";
            const key = `${field.uid}.${i}.${innerField.uid}.${blockOrGroupField.uid}`;
            console.log("DATA", data);
            console.log("INDEX", i);
            console.log("FIELD UID", field.uid);
            console.log("INNER UID", innerField.uid);
            console.log("BORGF UID", blockOrGroupField.uid);
            // console.log(key, "F", innerField.uid, "DATA", data[field.uid][i]);
            const fieldValue =
              field.data_type === "blocks"
                ? data[field.uid][i][innerField.uid][blockOrGroupField.uid]
                : data[field.uid][i][blockOrGroupField.uid];
            result[key] = fieldValue;
          }
        });
        i++;
      });
    }
  });
  console.log(result);
  return result;
};

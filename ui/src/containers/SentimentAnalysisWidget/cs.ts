import { IDictionary, IFieldData, IFieldDetails } from "./interfaces";

import axios from "axios";
import config from "./config.json";
import { getCSOptions } from "../../common/utils/axios";

const getContentTypeFields = async (contentTypeUid: string, data: any): Promise<IFieldDetails> => {
  const options = getCSOptions({ method: "GET" });
  const cts = await axios(`${config.CS_API_HOST}/v3/content_types/${contentTypeUid}`, options);
  const fields = cts.data.content_type.schema as any[];
  return Promise.resolve({
    data_type: "reference",
    display_name: cts.data.content_type.title,
    uid: contentTypeUid,
    schema: fields,
  });
};

const getGlobalFieldFields = async (gfUid: string, data: any): Promise<IFieldDetails> => {
  const options = getCSOptions({ method: "GET" });
  const gfs = await axios(`${config.CS_API_HOST}/v3/global_fields/${gfUid}`, options);
  const fields = gfs.data.global_field.schema as any[];
  return Promise.resolve({
    data_type: "global_field",
    display_name: gfs.data.global_field.title,
    uid: gfUid,
    schema: fields,
  });
};

export const getEntrySentences = async (contentTypeUid: string, data: any): Promise<IDictionary> => {
  const fields = await getContentTypeFields(contentTypeUid, data);
  const d: IFieldData = {
    uid: contentTypeUid,
    display_name: "",
    key: "",
    value: data,
  };
  const result = await getSentencesFromContent(fields, d);
  return result;
};

export const getGlobalFieldSentences = async (globalFieldUid: string, data: IFieldData): Promise<IDictionary> => {
  const fields = await getGlobalFieldFields(globalFieldUid, data);
  const d: IFieldData = {
    uid: globalFieldUid,
    display_name: data.display_name,
    key: data.key,
    value: data,
  };
  const result = await getSentencesFromContent(fields, d);
  return result;
};

const getDictionaryFromTextField = (fieldData: IFieldData): IDictionary => {
  let result: IDictionary = {};
  if (Array.isArray(fieldData.value)) {
    fieldData.value.forEach((v, i) => {
      const key = `${fieldData.key}[${i}]`;
      const display_name = `${fieldData.display_name}[${i}]`;
      result[key] = {
        key: key,
        display_name: display_name,
        value: v,
      };
    });
  } else {
    result[fieldData.key] = fieldData;
  }

  return result;
};

const getDictionaryFromBlockField = (schemaField: any, fieldData: IFieldData) => {
  let result: IDictionary = {};
  const possibleBlocks = getPossibleBlocks(schemaField);
  const data = fieldData.value;
  if (Array.isArray(data)) {
    // console.log("ARRAY");
    let i = 0;
    data.forEach((block: any) => {
      // console.log("BLOCK", block);
      possibleBlocks.forEach((possibleBlock: any) => {
        // console.log("POSSIBLE BLOCK", possibleBlock.uid);
        if (block[possibleBlock.uid] !== undefined) {
          const fd: IFieldData = {
            uid: block.uid,
            key: `${fieldData.key}[${i}]`,
            display_name: `${possibleBlock.display_name}[${i}]`,
          };
          result = { ...result, ...getSentencesFromBlock(possibleBlock, block[possibleBlock.uid], fd) };
          i++;
        }
      });
    });
  } else {
    possibleBlocks.forEach((possibleBlock: any) => {
      if (data[possibleBlock.uid] !== undefined) {
        result = { ...result, ...getSentencesFromBlock(possibleBlock, data[possibleBlock.uid], fieldData) };
      }
    });
  }
  return result;
};

const getPossibleBlocks = (schemaField: any) => {
  const possibleBlocks = schemaField.blocks.map((block: any) => {
    return {
      data_type: "block",
      display_name: block.title,
      uid: block.uid,
      schema: block.schema,
    };
  });
  return possibleBlocks;
};

const getDictionaryFromGlobalField = async (gfUid: string, data: IFieldData): Promise<IDictionary> => {
  return await getGlobalFieldSentences(gfUid, data);
};

const getSentencesFromContent = (fields: IFieldDetails, data: IFieldData): IDictionary => {
  let result: IDictionary = {};
  fields.schema.forEach(async (schemaField: any) => {
    const key = data.key !== "" ? `${data.key}.${schemaField.uid}` : schemaField.uid;
    const display_name =
      data.display_name !== "" ? `${data.display_name}.${schemaField.display_name}` : schemaField.display_name;
    const value = data.value[key];
    const fieldData: IFieldData = {
      uid: schemaField.uid,
      display_name: display_name,
      key: key,
      value: value,
    };
    console.log("FIELD TYPE", schemaField.data_type);
    switch (schemaField.data_type) {
      case "text":
        result = { ...result, ...getDictionaryFromTextField(fieldData) };
        break;
      case "blocks":
        result = { ...result, ...getDictionaryFromBlockField(schemaField, fieldData) };
        break;
      case "group":
        console.log("GROUP", fieldData);
        // result = { ...result, ...getDicionaryFromGroupField(field, data, field.uid) };
        break;
      case "global_field":
        const dict = await getDictionaryFromGlobalField(schemaField.uid, fieldData);
        result = { ...result, ...dict };
        break;
      default:
        break;
    }
  });
  console.log("RESULT", result);
  return result;
};

const getSentencesFromBlock = (possibleBlock: any, data: any, fieldData: IFieldData): IDictionary => {
  let result: IDictionary = {};
  possibleBlock.schema.forEach((field: any) => {
    if (data[field.uid] !== undefined) {
      const value = data[field.uid];
      const fd: IFieldData = {
        uid: field.uid,
        key: `${fieldData.key}.${field.uid}`,
        display_name: `${fieldData.display_name} > ${field.display_name}`,
        value: value,
      };
      switch (field.data_type) {
        case "text":
          result = { ...result, ...getDictionaryFromTextField(fd) };
          break;
        case "blocks":
          result = { ...result, ...getDictionaryFromBlockField(field.schema, fd) };
          break;
        case "group":
          break;
        case "referece":
          break;
      }
    }
  });
  return result;
};

const getJsonTexts = (json: any): string => {
  console.log("JSON");
  traverse(json, process);
  return "";
};

function process(key: any, value: any) {
  console.log(key + " : " + value);
}

function traverse(o: any, func: any) {
  for (var i in o) {
    func.apply(o, [i, o[i]]);
    if (o[i] !== null && typeof o[i] == "object") {
      //going one step down in the object tree!!
      traverse(o[i], func);
    }
  }
}

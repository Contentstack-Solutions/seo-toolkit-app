export interface IDictionary {
  [key: string]: any;
}

export interface IFieldInfo {
  data_type: string;
  display_name: string;
  uid: string;
}

export interface IFieldData {
  uid: string;
  key: string;
  display_name: string;
  value?: any;
}

export interface IFieldDetails extends IFieldInfo {
  schema: any[];
}

import "@contentstack/venus-components/build/main.css";
import "./styles.scss";

import { Field, Select } from "@contentstack/venus-components";
import { IDictionary, getFieldsDictionary } from "./cs";
/* Import React modules */
import React, { useEffect, useState } from "react";
import { TypeEntryData, TypeSDKData } from "../../common/types";

/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { DonutChart } from "react-circle-chart";
import { getSentiment } from "./gc";

/* Import our modules */
// import localeTexts from "../../common/locale/en-us";

interface IOption {
  id: number;
  label: string;
  value: string;
  selected?: boolean;
  options?: IOption[];
}

const AllFieldOptions: IOption = {
  id: 0,
  label: "All Fields",
  value: "all",
  selected: true,
};
const SentimentSidebarWidget: React.FC = function () {
  const [entryData, setEntryData] = useState<TypeEntryData>({ title: "" });
  const [entry, setEntry] = useState<any>();
  const [sentiment, setSentiment] = useState<any>();
  const [widget, setWidget] = useState<any>();
  const [fieldOptions, setFieldOptions] = useState<IOption[]>([AllFieldOptions]);
  const [selectedField, setSelectedField] = useState<IOption>(AllFieldOptions);
  const [config, setConfig] = useState<any>();
  const [sdkReady, setSdkReady] = useState<boolean>(false);
  const [location, setLocation] = useState<any>();

  const [fields, setFields] = useState<IDictionary>();

  const onChangeEntry = (a: any) => {
    console.log("hello");
  };

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    if (self === top) {
      const msg = "This extension can only be used in Contentstack";
      console.log("Extension loaded outside Contentstack!", msg);
    } else {
      ContentstackAppSdk.init().then(async (appSdk) => {
        const config = await appSdk?.getConfig();
        setConfig(config);
        const entryDataFromSDK = appSdk?.location?.SidebarWidget?.entry?.getData();
        setEntry(appSdk?.location?.SidebarWidget?.entry);
        setWidget(appSdk);
        setLocation(appSdk?.location);
        setEntryData(entryDataFromSDK); // entryData is the whole entry object from CMS that contains all the data in the current entry for which sidebar is opened.
        // console.log("ENTRY DATA", JSON.stringify(entryDataFromSDK));
        // console.log("ENTRY", entry);
        setSdkReady(true);
      });
    }
  }, []);

  useEffect(() => {
    if (entry && entryData && entry.content_type.uid) {
      getFieldsDictionary(entry.content_type.uid, entryData)
        .then((res) => {
          setFields(res);
          setFieldOptions(() => {
            const options = Object.keys(res).map((key, idx) => {
              return {
                id: idx + 1,
                label: key,
                value: key,
              };
            });
            getSentiment(Object.values(res).join(". "))
              .then((sentiment) => {
                setSentiment(sentiment.data);
              })
              .catch((err) => {
                setSentiment("Something went wrong");
              });
            return [AllFieldOptions, ...options];
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [entry, entryData]);

  return (
    <>
      {/* <Field labelText="Field">
        <Select
          maxMenuHeight={200}
          value={AllFieldOptions}
          isClearable
          onChange={(o: IOption) => {}}
          options={fieldOptions}
          isDisabled={!sdkReady}
          selectedLabel={selectedField.label}
        />
      </Field> */}

      {selectedField.value === "all" && <></>}
      {/* <>{JSON.stringify(sentiment)}</> */}

      {sentiment && (
        <div className="center">
          <Field labelText="Positive Sentiment">
            <DonutChart size={"sm"} items={[{ label: "Sentiment", value: sentiment.documentSentiment.score * 100 }]} />
          </Field>
        </div>
      )}
    </>
    // <div className="layout-container">
    //   {state.appSdkInitialized && (
    //     <div className="sidebar-wrapper">
    //       {/* <FieldLabel htmlFor={state?.config?.configField1} className="sidebar-field">
    //         {state.config.configField1}
    //       </FieldLabel>
    //       <div className="entry-wrapper">
    //         <FieldLabel htmlFor="entry-title" className="sidebar-field">
    //           {localeTexts.sidebarWidget.titleCaption}
    //         </FieldLabel>
    //         <FieldLabel htmlFor={entryData?.title} className="sidebar-field">
    //           {entryData?.title}
    //         </FieldLabel>
    //       </div> */}
    //       {JSON.stringify(sentiment)}
    //     </div>
    //   )}
    // </div>
  );
};

export default SentimentSidebarWidget;

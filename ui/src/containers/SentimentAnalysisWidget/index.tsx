import "@contentstack/venus-components/build/main.css";
import "./styles.scss";
import "react-dropdown/style.css";

import DataTable, { TableColumn } from "react-data-table-component";
/* Import React modules */
import React, { useEffect, useState } from "react";

/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import Dropdown from "react-dropdown";
import { IDictionary } from "./interfaces";
import { TypeEntryData } from "../../common/types";
import { getEntrySentences } from "./cs";
import { getSentiment } from "./gc";
import { kill } from "process";

/* Import our modules */
// import localeTexts from "../../common/locale/en-us";
const columns: TableColumn<any>[] = [
  {
    name: "Sentence",
    selector: (row) => row.text.content,
    sortable: true,
  },
  {
    name: "Score",
    selector: (row) => row.sentiment.score,
    sortable: true,
  },
  {
    name: "Magnitude",
    selector: (row) => row.sentiment.magnitude,
    sortable: true,
  },
];

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
  const [entryData, setEntryData] = useState<TypeEntryData>();
  const [entry, setEntry] = useState<any>();
  const [sentiment, setSentiment] = useState<any>();
  const [widget, setWidget] = useState<any>();
  const [fieldOptions, setFieldOptions] = useState<IOption[]>([AllFieldOptions]);
  const [selectedField, setSelectedField] = useState<IOption>(AllFieldOptions);
  const [config, setConfig] = useState<any>();
  const [sdkReady, setSdkReady] = useState<boolean>(false);
  const [location, setLocation] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const [fields, setFields] = useState<IDictionary>();

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
      // console.log(entryData, entry.content_type.uid);
      getEntrySentences(entry.content_type.uid, entryData)
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

            getSentiment(
              Object.values(res)
                .map((v) => v.value) // get all the values of the dictionary
                .join(". ") // join all the values with a new line ")
            )
              .then((sentiment) => {
                // console.log("SENTIMENT", sentiment.data);
                setSentiment(sentiment.data);
                setLoading(false);
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
      {selectedField.value === "all" && <></>}

      {sentiment && (
        <>
          <h2 className="sentiment">
            <span
              className={`sentiment-${sentiment.documentSentiment.score >= 0 ? "positive" : "negative"}`}
            >{`${Math.abs(sentiment.documentSentiment.score * 100)}% ${
              sentiment.documentSentiment.score >= 0 ? "Positive" : "Negative"
            }`}</span>{" "}
            Sentiment
          </h2>
          <h4 className="sentiment">{`Magnitude of sentiment: ${sentiment.documentSentiment.magnitude}`}</h4>
          <br />
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
          <Dropdown options={fieldOptions} onChange={() => {}} value={selectedField} />
          <br />
          {/* <DonutChart
            size={"sm"}
            items={[{ label: "Sentiment", value: Math.abs(sentiment.documentSentiment.score * 100) }]}
            trackWidth={"sm"}
          /> */}
          <br />
          <br />
          <hr />
          <br />
          <h2 className="sentiment">Details</h2>
          <br />
          {/* {JSON.stringify(sentiment.sentences)} */}
          <DataTable columns={columns} data={sentiment.sentences} />
        </>
      )}
    </>
  );
};

export default SentimentSidebarWidget;

/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { FieldLabel, TextInput } from "@contentstack/venus-components";
import { TypeSDKData, TypeEntryData } from "../../common/types";
/* Import our modules */
import localeTexts from "../../common/locale/en-us";
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";
import { unified } from "unified";
import retextEnglish from "retext-english";
import retextEquality from "retext-equality";
import retextStringify from "retext-stringify";
import retextSimplify from "retext-simplify";
import retextProfanities from "retext-profanities";
import retextIntensify from "retext-intensify";

const BiasedLanguageWidget: React.FC = function () {
  const [entryData, setEntryData] = useState<TypeEntryData>({ title: "" });
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });
  const [insensitivelanguage, setInsensitivelanguage] = useState("");

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
      const config = await appSdk?.getConfig();

      const entryDataFromSDK =
        appSdk?.location?.SidebarWidget?.entry?.getData();
      setEntryData(entryDataFromSDK); // entryData is the whole entry object from CMS that contains all the data in the current entry for which sidebar is opened.
      setState({
        config,
        location: appSdk.location,
        appSdkInitialized: true,
      });
    });
  }, []);

  const onChangeText = (value: string) => {
    callRetext(value);
  };

  const callRetext = (text: string) => {
    unified()
      .use(retextEnglish)
      .use(retextEquality)
      .use(retextStringify)
      .use(retextSimplify)
      .use(retextProfanities)
      .use(retextIntensify)
      .process(text)
      .then((file: any) => {
        let result = "";
        file.messages.map((value: any) => (result += value.message + ". "));
        setInsensitivelanguage(result);
      });
  };

  return (
    <div className="layout-container">
      {state.appSdkInitialized && ( 
        <div className="sidebar-wrapper">
          <TextInput
            onChange={(e: any) => onChangeText(e.target.value)}
            value=""
            name={"sample"}
          ></TextInput>
          <FieldLabel htmlFor={"sample"} className="color-label">
            {insensitivelanguage}
          </FieldLabel>
        </div>
      )}
    </div>
  );
};

export default BiasedLanguageWidget;

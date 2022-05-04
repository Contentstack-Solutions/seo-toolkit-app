/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";

/* Import React modules */
import React, { useEffect, useState } from "react";
import { TypeEntryData, TypeSDKData } from "../../common/types";

/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { FieldLabel } from "@contentstack/venus-components";
/* Import our modules */
import localeTexts from "../../common/locale/en-us";

const SidebarWidget: React.FC = function () {
  const [entryData, setEntryData] = useState<TypeEntryData>({ title: "" });
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    if (self === top) {
      const msg = "This extension can only be used in Contentstack";
      console.log("Extension loaded outside Contentstack!", msg);
      setState({
        config: {},
        location: {},
        appSdkInitialized: false,
      });
    } else {
      ContentstackAppSdk.init().then(async (appSdk) => {
        const config = await appSdk?.getConfig();

        const entryDataFromSDK = appSdk?.location?.SidebarWidget?.entry?.getData();
        setEntryData(entryDataFromSDK); // entryData is the whole entry object from CMS that contains all the data in the current entry for which sidebar is opened.
        setState({
          config,
          location: appSdk.location,
          appSdkInitialized: true,
        });
      });
    }
  }, []);

  return (
    // <div className="layout-container">
    //   {state.appSdkInitialized && (
    //     <div className="sidebar-wrapper">
    //       <FieldLabel htmlFor={state?.config?.configField1} className="sidebar-field">
    //         {state.config.configField1}
    //       </FieldLabel>
    //       <div className="entry-wrapper">
    //         <FieldLabel htmlFor="entry-title" className="sidebar-field">
    //           {localeTexts.sidebarWidget.titleCaption}
    //         </FieldLabel>
    //         <FieldLabel htmlFor={entryData?.title} className="sidebar-field">
    //           {entryData?.title}
    //         </FieldLabel>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="layout-container"></div>
  );
};

export default SidebarWidget;

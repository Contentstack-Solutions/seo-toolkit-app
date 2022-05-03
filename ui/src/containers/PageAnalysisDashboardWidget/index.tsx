/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { FieldLabel } from "@contentstack/venus-components";
import { TypeSDKData } from "../../common/types";
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";

class DashboardWidget extends Component {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

  componentDidMount() {
    ContentstackAppSdk.init().then(async (appSdk) => {
      const config = await appSdk.getConfig();

      appSdk?.location?.DashboardWidget?.frame?.enableAutoResizing?.();
      appSdk?.location?.DashboardWidget?.frame?.updateHeight?.(800);

      setState({
        config,
        location: appSdk.location,
        appSdkInitialized: true,
      });
    });
  };

  render() {
    return (
      <>

<div className="layout-container">
        {state.appSdkInitialized
        ?
        <h2>Page analysis #2</h2>
  
        :
        null
        }
      </div>

      </>

    );
  }


};

export default DashboardWidget;



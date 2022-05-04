/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { TextInput, Button, FieldLabel, InstructionText } from "@contentstack/venus-components"
import { TypeSDKData } from "../../common/types";
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";

interface IDomainSettings {
  domainName: string,
  results: any
}

const DashboardWidget: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

  const [domainSettings, setDomainSettings] = useState<IDomainSettings>({
    domainName: '',
    results: null
  });

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const analyzeWebsite = async (domainName: string) => {
    let key = 'AIzaSyCfraf3NrUxoHUygKGunRvRefWq0zXw_wY';
    let response = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${domainName}&key=${key}`)

    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    let toJSON = await response.json()
    
    setIsLoading(false)
    setDomainSettings({
      domainName: domainSettings.domainName,
      results: toJSON
    })

    setTimeout(() => {
      console.log(domainSettings.results)
    }, 5000);
  }

  const handleInputField = (event:any) => {
    // console.log(event.target.value)
    setDomainSettings({
      domainName: event.target.value,
      results: {}
    })
    // console.log(domainSettings)
  }

  const onSubmit = () => {
    if (domainSettings.domainName) {
      setIsLoading(true)
      analyzeWebsite(domainSettings.domainName);
    }
  }

  useEffect(() => {
    console.log(domainSettings.results)

    ContentstackAppSdk.init().then(async (appSdk) => {
      const config = await appSdk.getConfig();
      appSdk?.location?.DashboardWidget?.frame?.enableResizing?.();
      appSdk?.location?.DashboardWidget?.frame?.updateHeight?.(800);
      appSdk?.location?.DashboardWidget?.frame?.enableAutoResizing?.();

      setState({
        config,
        location: appSdk.location,
        appSdkInitialized: true,
      });
    });
  }, []);

  return (
    <div className="container">
      {
      state.appSdkInitialized
      ?
      <>
        <div className="control-wrapper">
          <InstructionText>Enter a web page URL</InstructionText>
          <TextInput
            type='text'
            autoFocus={true}
            width='medium'
            value={domainSettings.domainName}
            placeholder='Enter a web page URL'
            onChange={(e:any) => handleInputField(e)}
          />
          <Button 
            size='large' 
            isLoading={isLoading} 
            onClick={onSubmit}>Analyze</Button>
        </div>
        {isLoading ? <div className="loading-message">Running performance analysis</div> : null}


        {domainSettings.results ?
        
        <div className="analysis-results">
          <p>First Contentful Paint: {domainSettings?.results?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS.category}</p>
          <p>First Contentful Paint: {domainSettings?.results?.lighthouseResult?.audits['first-contentful-paint'].displayValue}</p>
          <p>Speed Index: {domainSettings?.results?.lighthouseResult?.audits['speed-index'].displayValue}</p>
          
          
          </div>
        : null
      
      
      }


      </>
      :
      null 
      }
    </div>
  );
};

export default DashboardWidget;

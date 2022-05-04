/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { TextInput, Button, InstructionText } from "@contentstack/venus-components"
import { TypeSDKData } from "../../common/types";
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";
import validator from 'validator'

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
  const [error, setError] = useState<boolean>(false)

  const analyzeWebsite = async (domainName: string) => {

    let response:any = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${domainName}&key=${process.env.REACT_APP_GOOGLE_KEY}`)
    let toJSON = await response.json()

    if (toJSON.error) {
      console.log(toJSON.error.message)
      setIsLoading(false)
      setDomainSettings({
        domainName: '',
        results: toJSON
      })
    } else {
      setIsLoading(false)
      setDomainSettings({
        domainName: domainSettings.domainName,
        results: toJSON
      })
      
    }
  }

  const handleInputField = (event:any) => {
    if (!validator.isURL(event.target.value)) {
      setError(true)
    } else {
      setDomainSettings({
        domainName: event.target.value,
        results: null
      })
      setError(false)
    }
  }

  const onSubmit = () => {
    if (domainSettings.domainName) {
      setIsLoading(true)
      analyzeWebsite(domainSettings.domainName);
      setDomainSettings({
        domainName: domainSettings.domainName,
        results: null
      })
    }
  }

  useEffect(() => {
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
          <InstructionText>Web page URL</InstructionText>
          <TextInput
            error={error}
            required
            type='url'
            autoFocus={true}
            width='large'
            value={domainSettings.domainName}
            placeholder='Enter a web page URL'
            onChange={(e:any) => handleInputField(e)}
          />
          <Button 
            disabled={!domainSettings.domainName}
            size='large' 
            isLoading={isLoading} 
            onClick={onSubmit}>Analyze</Button>
        </div>
        {isLoading ? <div className="loading-message">Running performance analysis</div> : null}
        {
        domainSettings.results 
        ?
          <div className="analysis-results">
            <div className="card">
              <h4>Chrome User Experience Report Results</h4>
              <p>Cumulative Layout Shift Score: {domainSettings?.results?.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE.category ? domainSettings?.results?.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE.category : 'N/A'}</p>
              <p>First Contentful Paint: {domainSettings?.results?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS.category ? domainSettings?.results?.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS.category : 'N/A'}</p>
              <p>First Input Delay: {domainSettings?.results?.loadingExperience?.metrics?.FIRST_INPUT_DELAY_MS.category ? domainSettings?.results?.loadingExperience?.metrics?.FIRST_INPUT_DELAY_MS.category : 'N/A'}</p>
              <p>Largest Contentful Paint: {domainSettings?.results?.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS.category ? domainSettings?.results?.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS.category : 'N/A'}</p>
              <p>Overall loading experience: {domainSettings?.results?.loadingExperience?.overall_category ? domainSettings?.results?.loadingExperience?.overall_category : 'N/A'}</p>
            </div>

            <div className="card">
              <h4>Lighthouse Results</h4>
              <p>First Contentful Paint: {domainSettings?.results?.lighthouseResult?.audits['first-contentful-paint'].displayValue ? domainSettings?.results?.lighthouseResult?.audits['first-contentful-paint'].displayValue : 'N/A'}</p>
              <p>Speed Index: {domainSettings?.results?.lighthouseResult?.audits['speed-index'].displayValue ? domainSettings?.results?.lighthouseResult?.audits['speed-index'].displayValue : 'N/A'}</p>
              <p>Speed Index Score: {domainSettings?.results?.lighthouseResult?.audits['speed-index'].score ? domainSettings?.results?.lighthouseResult?.audits['speed-index'].score : 'N/A'}</p>
              <p>Time To Interactive: {domainSettings?.results?.lighthouseResult?.audits['interactive'].displayValue ? domainSettings?.results?.lighthouseResult?.audits['interactive'].displayValue : 'N/A'}</p>
              <p>First Meaningful Paint: {domainSettings?.results?.lighthouseResult?.audits['first-meaningful-paint'].displayValue ? domainSettings?.results?.lighthouseResult?.audits['first-meaningful-paint'].displayValue : 'N/A'}</p>
              {/* <p>First CPU Idle: {domainSettings?.results?.lighthouse?.audits['first-cpu-idle'].displayValue}</p>
              <p>Estimated Input Latency: {domainSettings?.results?.lighthouse?.audits['estimated-input-latency'].displayValue}</p> */}
            </div>
          </div>
        : 
        null
        }
      </>
      :
      null 
      }
    </div>
  );
};

export default DashboardWidget;

import ContentstackSDK from "@contentstack/app-sdk";
import "./style.css";
import { FleschKincaidGradeLevel } from "./flesch-kincaid-grade-level";


export default ContentstackSDK.init().then(async (sdk) => {
  const extensionObj = await sdk["location"];
  const RTE = await extensionObj["RTEPlugin"];
  
  if(!RTE) return [];
  const fleschKincaidGradeLevel = FleschKincaidGradeLevel(RTE);
  return {
    fleschKincaidGradeLevel
  };
});
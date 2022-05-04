import { IRteParam } from "@contentstack/app-sdk/dist/src/RTE/types";
import {syllable} from 'syllable'

const tokenizer = require("sbd");

interface RteExtended extends IRteParam {
  gradeLevelIndicator: HTMLSpanElement | null;
  ref: HTMLDivElement;
}

export const FleschKincaidGradeLevel = (RTE: any) => {
  const fleschKincaidGradeLevel = RTE("flesch-kincaid-grade-level", (rte: RteExtended) => {
    rte.gradeLevelIndicator = addGradeLevelDisplay(rte.ref);
    updateGradeLevel(rte);

    return {
      title: "Flesch-Kincaid Grade Level",
      display: [],
    };
  });

  fleschKincaidGradeLevel.on("change", ({ rte }: { rte: RteExtended }) => {
    updateGradeLevel(rte);
  });
  return fleschKincaidGradeLevel;
};

const addGradeLevelDisplay = (ref: HTMLDivElement): HTMLSpanElement | null => {
  const gradeLevel = document.createElement("span");
  gradeLevel.id = "grade-level";
  gradeLevel.innerHTML = 'Grade Level: <span id="grade-level-value">0</span>';
  ref.appendChild(gradeLevel);
  return gradeLevel.querySelector("#grade-level-value");
}

const updateGradeLevel = (rte: RteExtended) => {
  const gradeLevelIndicator = rte.gradeLevelIndicator;
  if (!gradeLevelIndicator) return;
  const value = rte.getNode([0]);
  //@ts-ignore
  const children = value[0]["children"];
  let fullText = "";
  children.forEach((_: any, idx: number) => {
    fullText += `${rte.string([0, idx])}\n`;
  });


  const sentences = tokenizer.sentences(fullText, { "newline_boundaries": true }) as string[];
  const words = sentences.flatMap((sentence: string) => {
    return sentence.split(" ").filter((word: string) => word.length > 0);
  }, []);

  const syllables = words.flatMap((word: string) => {
    return syllable(word);
  }, []);

  const totalSyllables = syllables.reduce((acc: number, curr: number) => (acc + curr), 0);

  const fleschKincaidGradeLevel = 0.39 * (words.length / sentences.length) + 11.8 * (totalSyllables / words.length) - 15.59;

  gradeLevelIndicator.innerHTML = String(Math.round(fleschKincaidGradeLevel));
}
import e from "express";
import Fallacy from "../database/models/Fallacy";
import fallacies from "./fallacies.json" assert { type: 'json' }; 
// Increases the fallacy
const increaseFallacy = async (fallacyName, FallacyTable) => {
  let fallacyNameNoSpace = fallacyName.replaceAll(' ', '');
  console.log('fallacy table', FallacyTable);

  if(!fallacies[fallacyName]){
    await FallacyTable.increment('unknown');
    await FallacyTable.increment('total');
  } else {
    await FallacyTable.increment(fallacyNameNoSpace);
    await FallacyTable.increment('total');
    console.log('after incrementing fallacy', FallacyTable)
  } 
}


const getPercentageOfFallacy = async (fallacyArray, fallacyTable) => {
  console.log('calculating percentage');
  let totalFound = 0;
  let unknownsIncluded = false;

  for (const fallacy of fallacyArray) {
    let fallacyNameNoSpace = fallacy.replaceAll(' ', '');
    console.log('fallacyTable', fallacyTable);
    console.log(fallacyTable[fallacyNameNoSpace]);
    console.log('checking this', fallacyNameNoSpace);
    if (fallacyTable[fallacyNameNoSpace.toLowerCase()]) {
      console.log(fallacy, fallacyTable[fallacyNameNoSpace.toLowerCase()]);
      totalFound += fallacyTable[fallacyNameNoSpace.toLowerCase()];
    } else if (!unknownsIncluded) {
      totalFound += fallacyTable.unknown || 0;
      unknownsIncluded = true;
    }
  }

  const percentage = Math.floor((totalFound / fallacyTable.total) * 100);
  return percentage;
};


export { increaseFallacy, getPercentageOfFallacy }
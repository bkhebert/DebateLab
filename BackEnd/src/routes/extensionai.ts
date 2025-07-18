import express  from 'express';
import { GoogleGenAI }  from '@google/genai';
import rateLimitOnePerDay from '../middleware/rateLimit.js';
import normalizeToArray from '../utils/normalizeToArray.js';
import { getPercentageOfFallacy, increaseFallacy } from '../utils/fallacycounter.js';
import Fallacy from '../database/models/Fallacy.js';
import Download from '../database/models/Download.js';
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_KEY });

const extensionAI = express.Router();
extensionAI.options('/fact', (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return res.sendStatus(204);
});
extensionAI.use(express.json());


extensionAI.post('/fact', rateLimitOnePerDay, async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  console.log('ai Router post to /fact')
  console.log(req.body)
  console.log('adding an analysis via extension...')
  try{
    const [analysisRow] = await Download.findOrCreate({
      where: { name: 'analysisviaextension' },
      defaults: { count: 0 }
    });

    analysisRow.count += 1;
    await analysisRow.save();
    console.log('saved an analysis via extension')
  } catch (err) {
    console.error(err, 'failed to create analysis via extension table or count this analysis')
  }
  if (!req.body.message) {
    res.sendStatus(400); // There must be a message on the request body.
  } else {
    if(process.env.TEST_AI == 'true'){
      return res.status(200).send({ 
        "factCheckedMessage": "this message is fact checked", 
        "factCheckedStatement": "this statement is factchecked"
       })
    }
    try {
      const { text } = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: 
        `Below you will find a message that needs to be fact checked.
        While trying keep the message as close to the original as you can,
        check the message false information, and if it does have incorrect information,
        rewrite it to contain the correct information while keeping message as close
        to the original as possible.

        Follow these rules when fact checking:
        - Check for fallacious arguments, things that violate the 'RIFUT' rule in logic:
          - R: Reasonable
            - By reasonable, I mean 'non fallacious'.
          - I: Independent of the Claim
          - F: Free of Dubious Assumption
          - U: Unambiguous
          - T: True
        - Check for logical fallacies like:
          - Appeal to authority
          - Appeal to ignorance
          - Appeal to pity
          - Appeal to emotion
          - Straw man fallacy
          - Slippery slope fallacy
          - Genetic fallacy
          - False dilemma
          - Causation fallacy
          - Equivocation
          - Hasty Generalization

          I will need three things. 
          (1) The rewritten message if it needed to be rewritten while keeping the intent of the message.
          (2) If certain parts were changed, explain why.
          (3) All fallacies that were found in your check. Write this list 
          of found fallacies as if they are strings in an array. If no fallacy 
          is found, put an empty array here "[]" I intend to map 
          through this array so don't add extra formatting or parenthesis.

          Please send back your analysis in the form of a parseable JSON string that I can pass into JSON.parse(), and get back an object shaped like this:
          {
          rewrittenMessage: "your rewritten message"
          explanation: "your explanation of changes"
          allFallacies: ["Appeal to Authority", "Straw man fallacy", "False dilemma", "Hasty generalization", "Slippery slope fallacy"]
          }
          Ensure the keys in this object match exactly as written.
          Message: ${req.body.message}
        `,
            });
            console.log('the returned text from ai');
            console.log(text);
            if (typeof text !== 'string') {
                console.error('text is not a string');
                console.log(text);
                return res.sendStatus(500);
            }
            //const splitText = text.split('*****');
            //console.log('text has been split');
            //console.log(splitText);
            // let factCheckedMessage = splitText[2].slice(1, -2);
            // let factCheckedStatement = splitText[4].slice(1, -1);
            // let listOfFallacies = normalizeToArray(splitText[6].slice(1, -1));
            const parsedText = JSON.parse(text.slice(7, -3));
            console.log(parsedText);
            let factCheckedMessage = parsedText.rewrittenMessage;
            console.log('fact checked message', factCheckedMessage);
            let factCheckedStatement = parsedText.explanation;
            console.log('fact checked statement', factCheckedStatement);
            let listOfFallacies = normalizeToArray(parsedText.allFallacies);
            console.log('lilst of fallacies', listOfFallacies);
            console.log('type of list', typeof listOfFallacies);
            console.log('increasing fallacies in the database...');
await Fallacy.findOrCreate({
  where: {
    title: "Admin"
  }
}).then(async ([data, created]) => {
  for (const fallacy of listOfFallacies) {
    await increaseFallacy(fallacy.toLowerCase(), data);
  }
  const percentage = await getPercentageOfFallacy(listOfFallacies, data);

  console.log('sending to the front end...', percentage);
  res.status(200).send({ factCheckedMessage, factCheckedStatement, listOfFallacies, percentage });
});


      
    } catch (error) {
      console.error('Failed to POST /api/ai/fact ', error);
      res.sendStatus(500);
    }
  }
});

// extensionAI.post('/neutral', async (req: any, res: any) => {
//   console.log('ai neutral route reached')
//   if (!req.body.message) {
//     res.sendStatus(400); // There must be a message on the request body.
//   } else {
//     try {
//       const { text } = await ai.models.generateContent({
//         model: 'gemini-2.0-flash',
//         contents: 
// `Below you will find a message that has been fact checked, 
// but now needs to be checked for charged language.
// While trying to keep the message as close to the original, 
// only rewrite the message if you detect charged language.
// If you do rewrite the message,
// keep the intent of the message as close to the original as possible, 
// make it more neutral.

// I want the response structured in two parts using "(1) Rewritten Message" and "(2) Explanation of Change" as the labels:
// (1) The rewritten message if it needed to be rewritten while keeping the intent of the message.
// (2) If certain parts were changed, explain why.

// Please use no formatting in your response, which means you should not use bold, italics, or different font sizes.

// Place five "*" before and after each label, "(1) Rewritten Message" and "(2) Explanation of Change".
//           Message: ${req.body.message}
//         `,
//       });

//       const splitText = text.split('*****');
//       let neutralMessage = splitText[2].slice(1, -2);
//       let neutralStatement = splitText[4].slice(1, -1);

//       res.status(200).send({ neutralMessage, neutralStatement });
//     } catch (error) {
//       console.error('Failed to POST /api/ai/fact ', error);
//       res.sendStatus(500);
//     }
//   }
// });

export default extensionAI;
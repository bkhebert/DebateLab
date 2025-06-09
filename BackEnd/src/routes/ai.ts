import { Router }  from 'express';
import { GoogleGenAI }  from '@google/genai';
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_KEY });

const aiRouter = Router();

aiRouter.post('/fact', async (req: any, res: any) => {
  console.log('ai Router post to /fact')
  if (!req.body.message) {
    res.sendStatus(400); // There must be a message on the request body.
  } else {
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
          - Hasty Generalizations

        I want the response structured in two parts using "(1) Rewritten Message" and "(2) Explanation of Change" as the labels:
        (1) The rewritten message if it needed to be rewritten while keeping the intent of the message.
        (2) If certain parts were changed, explain why.

        Please use no formatting in your response, which means you should not use bold, italics, or different font sizes.

        Place five "*" before and after each label, "(1) Rewritten Message" and "(2) Explanation of Change".
          Message: ${req.body.message}
        `,
      });
      if(typeof text !== 'string'){
        console.error('text is not a string');
        console.log(text);
        return res.sendStatus(500);
      }
      const splitText = text.split('*****');
      let factCheckedMessage = splitText[2].slice(1, -2);
      let factCheckedStatement = splitText[4].slice(1, -1);

      res.status(200).send({ factCheckedMessage, factCheckedStatement });
    } catch (error) {
      console.error('Failed to POST /api/ai/fact ', error);
      res.sendStatus(500);
    }
  }
});

// aiRouter.post('/neutral', async (req: any, res: any) => {
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

export default aiRouter;
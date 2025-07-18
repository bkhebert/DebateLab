import { Router }  from 'express';
import { GoogleGenAI }  from '@google/genai';
import rateLimitOnePerDay from '../middleware/rateLimit.js';
import normalizeToArray from '../utils/normalizeToArray.js';
import { getPercentageOfFallacy, increaseFallacy } from '../utils/fallacycounter.js';
import Fallacy from '../database/models/Fallacy.js';
import Download from '../database/models/Download.js';
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_KEY });

const coverLetterGeneratorRouter = Router();

coverLetterGeneratorRouter.post('/coverlettergenerator', rateLimitOnePerDay, async (req: any, res: any) => {
  console.log('ai Router post to /coverlettergenerator')
   console.log('adding a coverlettercount...')
  try{
    const [coverLetterRow] = await Download.findOrCreate({
      where: { name: 'coverlettergenerator' },
      defaults: { count: 0 }
    });

    coverLetterRow.count += 1;
    await coverLetterRow.save();
    console.log('saved an coverLetter')
  } catch (err) {
    console.error(err, 'failed to create coverLetter table or count this coverLetter')
  }
  if (!req.body.resume || !req.body.application) {
    res.sendStatus(400); // There must be a resume and application on the request body.
  } else {
    if(process.env.TEST_AI == 'true'){
      return res.status(200).send({ 
        "coverletter": "this is the generated cover letter", 
       })
    }
    try {
      const { text } = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: 
        `You are writing a cover letter for an applicant applying for a job.

        The cover letter must :
        (1) include a short story about the applicant applying for the job that is relevant to the job being applied to.
        (2) be shorter than 3 paragraphs And readable in 1 minute or less.
        (3) not have any emojis or special formatting whatsoever.
        (4) include a strong opening, making it clear what role the applicant is applying for and why they are excited about it.
        (5) show what the applicant brings to the table and why they are a great fit for the role at the company.
        (6) show that the applicant has researched the company and why they are aligned to their values, product, or mission.
        (7) have a professional and confident tone
        (8) have a strong closing, that reaffirms the applicants interest and has a call to action (e.g. "I’d love to discuss how I can contribute to…")
        (9) Avoid typos or generic fillers (e.g. No "To whom it may concern" no copy-pasted fluff)
        (10) If you cannot find any information on something based from the listing or the applicants resume, simply exclude discussing it on the resume. 
        (11) Do not use any brackets or placeholders (e.g. I found your job on [Platform where job was found] or I've researched your company's focus on [mention something specific about the company's focus])
        Send back your coverLetter in the form of a parseable JSON string that I can pass into JSON.parse(), and get back an object shaped like this:
          {
          coverletter: "the generated cover letter."
          }
          Ensure the keys in this object match exactly as written.
        
        Here is the applicants resume: 
        ${req.body.resume}

        Here is a description of the job they are applying for: 
        ${req.body.application}
        `,
            });
            console.log('the returned text from ai');
            console.log(text);
            if (typeof text !== 'string') {
                console.error('text is not a string');
                console.log(text);
                return res.sendStatus(500);
            }
    try {
      const parsed = JSON.parse(text.slice(7, -3));
      console.log(parsed)
      console.log('above is a parsed version of what was returned from gemeni')
      console.log(parsed.coverletter);
      return res.status(200).send(parsed);
    } catch (e) {
      console.error("Could not parse Gemini's response:", text);
      return res.sendStatus(500);
    }

    } catch (error) {
      console.error('Failed to POST /api/ai/fact ', error);
      res.sendStatus(500);
    }
  }
});


export default coverLetterGeneratorRouter;
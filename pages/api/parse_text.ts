import { NextApiRequest, NextApiResponse } from 'next';
import drugInfo from '../interfaces/drugInfo';
import getDrugInteractions from "../backend_funcs/interactionChecker";
import generateSchedules from '../backend_funcs/genSchedules';
const BASE_URL = "https://api.openai.com/v1/chat/completions"

const parseText = async (query:string):Promise<drugInfo>=>{
  // Handle POST request
    // Example: Accessing POST data
    const interactions = await fetch(BASE_URL, {
      method: "POST",
      headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo-1106",
        "messages": [
            {
                "role": "system",
                "content": "You are a medical assistant that takes in text containing scrambled prescription text, parse the text (get base drug name(s)) extract in json: "+
                "{medName: string of original commercial name,drugNames: string[] of component chemicals,dosage: number of tablets, else amount of liquid in ml,timesPerDay: number, beforeMeal: boolean}"+
                "e.g. {medName:Panadol,drugNames:[Acetaminophen],dosage:20ml,timesPerDay:1,beforeMeal:false}"+
                "e.g. {medName:Panadol,drugNames:[Acetaminophen],dosage:1 tablet,timesPerDay:1,beforeMeal:false}"
            },
            {
                "role": "user",
                "content": query,
            }
        ],
        "response_format": {
            "type": "json_object"
        }
    })
    });

    const response = await interactions.json() 
    console.log(response.choices[0].message.content)
    return JSON.parse(response.choices[0].message.content)
}

export default async function handler(req: NextApiRequest, res:NextApiResponse<any>) {
  if (req.method === 'GET') {
    // Handle GET request
    res.status(200).json({ message: 'Hello' });
  } else if (req.method === 'POST') {
  try {
    const drugs:{[drugName:string]:string}={};
    const drugJsons:drugInfo[] = [];
    const queries = JSON.parse(req.body).queries
    console.log(queries)
    // const queries = req.body
    for (const query of queries) {
      const drugJson = await parseText(query);
      drugJson.drugNames.forEach((drug)=>{drugs[drug]=drugJson.medName})
      drugJsons.push(drugJson);
    }
    const interactions = await getDrugInteractions(drugs)
    const schedules = await generateSchedules(drugJsons);
    res.status(200).json({schedules:schedules,interactions:interactions});
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Error handling file upload' });
  }
  }else {
    // Handle other HTTP methods
    res.status(405).end(); // Method Not Allowed
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import drugInfo from '../../interfaces/drugInfo';
import db_handler from './handler';
const BASE_URL = "https://api.openai.com/v1/chat/completions"

const getDrugInteractions=async(drug_map:{[drugName:string]:string})=>{
  console.log(drug_map)
  const drug_levels:any[] = []
  const drugs = Object.keys(drug_map)
  for (let i=0;i<drugs.length-1;i++){
    for (let j=i+1;j<drugs.length;j++){
      const drugA=drugs[i]
      const drugB=drugs[j]
      console.log("Checking for:",drugA,drugB)
      const responseBody = await db_handler(`
        SELECT * FROM drug_interactions WHERE (drug_a = '${drugA}' AND drug_b = '${drugB}') OR (drug_a = '${drugB}' AND drug_b = '${drugA}');
      `)

      for (let i=0;i<responseBody.rows.length;i++){
        const doc = responseBody.rows[i]
        drug_levels.push([doc.level,drug_map[drugA],drug_map[drugB]])
      }
    }
  }
  return drug_levels;
  
}
// Function to generate .ics file
const generateSchedules = (data: drugInfo[]) =>{
  // Create a new calendar
  let res:any = []
  const interval_timings_map: { [index: number]: number[] } = {
    1: [9],
    2: [10, 19],
    3: [8, 12, 18],
    4: [8, 12, 18, 21],
    5: [5, 9, 12, 17, 21],
    6: [2, 6, 10, 14, 18, 21],
    8: [1, 3, 6, 9, 12, 15, 18, 21],
  };

  // Loop through the data to create events for each medication
  data.forEach((drug: drugInfo) => {
    // Loop to add events for each time the medicine should be taken
    if (!(drug.timesPerDay in Object.keys(interval_timings_map))) console.error("Error in passed values");
    interval_timings_map[drug.timesPerDay].forEach((startTime: number) => {
      const start = new Date();
      start.setHours(startTime,0,0,0);
      const end = new Date();
      end.setHours(startTime + 1,0,0,0);
      res.push({
        start: start,
        end: end, // End time is 1 hour after start time
        summary: `Take ${drug.dosage} pill(s) of ${drug.medName}`,
        description: `It's time to take ${drug.dosage} of ${
          drug.medName
        }. ${drug.beforeMeals ? "Take before meal." : "Take after meal."}`
      })
    });
  });
  return res;
}

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

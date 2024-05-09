import { NextApiRequest, NextApiResponse } from 'next';
import drugInfo from '../../interfaces/drugInfo';
import generateSchedules from './backend_funcs/generateSchedules';
import getDrugInteractions from './backend_funcs/getDrugNames';
import parseText from './backend_funcs/parseText';

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
    for (const query of queries) {
      const drugJson = await parseText(query);
      drugJson.drugNames.forEach((drug)=>{drugs[drug]=drugJson.medName})
      drugJsons.push(drugJson);
    }

    res.status(200).json(drugJsons);
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Error handling file upload' });
  }
  }else {
    // Handle other HTTP methods
    res.status(405).end(); // Method Not Allowed
  }
}

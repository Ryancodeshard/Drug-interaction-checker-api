import { NextApiRequest, NextApiResponse } from 'next';
import drugInfo from '../../interfaces/drugInfo';
import generateSchedules from './backend_funcs/generateSchedules';
import parseText from './backend_funcs/parseText';
import getDrugNames from './backend_funcs/getDrugNames';
import getDrugInteractions from './backend_funcs/getDrugInteractions';

export default async function handler(req: NextApiRequest, res:NextApiResponse<any>) {
  if (req.method === 'GET') {
    // Handle GET request
    res.status(200).json({ message: 'Hello' });
  } else if (req.method === 'POST') {
  try {
    const drugJsons:drugInfo[] = JSON.parse(req.body)
    const drugNames = await getDrugNames(drugJsons.map((row)=>(row.medName)))
    const drugMap:{drugName:string[]} = JSON.parse(drugNames)
    const drugs:{[drugName:string]:string}={}
    Object.entries(drugMap).forEach(([key,value]) => {
      value.forEach(row=>{
        drugs[row]=key
      })
    });
    // console.log(drugs)
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
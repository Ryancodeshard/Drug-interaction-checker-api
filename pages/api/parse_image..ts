import { NextApiRequest, NextApiResponse } from 'next';
import drugInfo from '../../interfaces/drugInfo';
import generateSchedules from './backend_funcs/generateSchedules';
import getDrugInteractions from './backend_funcs/getDrugNames';
import parseText from './backend_funcs/parseText';
import parseImage from './backend_funcs/parseImage';

export default async function handler(req: NextApiRequest, res:NextApiResponse<any>) {
  if (req.method === 'GET') {
    // Handle GET request
    res.status(200).json({ message: 'Hello' });
  } else if (req.method === 'POST') {
  try {
    const base64_data = JSON.parse(req.body)
    var stringLength = base64_data.length - 'data:image/png;base64,'.length;

    var sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
    var sizeInKb=sizeInBytes/1024;
    if (sizeInKb>2000) res.status(400).json("File size too big bruh. Has to be <2Mb, im not made of money you know :/") 

    const drugJson = await parseImage(base64_data)

    res.status(200).json(drugJson);
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Error handling file upload' });
  }
  }else {
    // Handle other HTTP methods
    res.status(405).end(); // Method Not Allowed
  }
}

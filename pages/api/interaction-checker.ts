// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://api.openai.com/v1/chat/completions"

export default async function handler(req: NextApiRequest, res:NextApiResponse<any>) {
  if (req.method === 'GET') {
    // Handle GET request
    res.status(200).json({ message: 'Hello' });
  } else if (req.method === 'POST') {
    // Handle POST request
    // Example: Accessing POST data
    const terms: string= req.body;
    const interactions = await fetch(BASE_URL, {
      method: "POST",
      headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": `Bearer ${process.env.GPT_TOKEN}`,
      },
      body: JSON.stringify({
          "model": "gpt-3.5-turbo-1106",
          "messages": [{
                  "role": "system",
                  "content": `You are a medical assistant that takes in csv drug names \
                  ,checking possible drug interactions. No interactions, send nothing. \
                  Else, send JSON: \
                  {interactions: [ {drugs: drug1,drug2, severity: Mild, Moderate, Severe, recommendation: reccomendation} ]}`
              },
              {
                  "role": "user",
                  "content": terms,
              }
          ],
          "response_format": {
              "type": "json_object"
          }
      })
    });

    const response = await interactions.json() 
    console.log(response.choices[0].message.content)
    res.status(200).json(response.choices[0].message.content)
  } else {
    // Handle other HTTP methods
    res.status(405).end(); // Method Not Allowed
  }
}
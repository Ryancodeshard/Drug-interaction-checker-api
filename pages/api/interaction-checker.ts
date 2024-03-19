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
    const { terms } = req.body;
    const interactions = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        "model": "gpt-3.5-turbo-1106",
        "messages": [
            {
                "role": "system",
                "content": "You are a medical assistant that takes in drug names seperated by commas as input and checks for possible drug interactions. If no interactions, don't send anything. Else, send back in this JSON format: {interactions: [ drug1,drug2:{Severity: Mild, Moderate, Severe, Reccomendation: Reason for severity} ]}"
            },
            {
                "role": "user",
                "content": terms
            }
        ],
        "response_format": {
            "type": "json_object"
        }
    }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    res.status(200).json(interactions)
  } else {
    // Handle other HTTP methods
    res.status(405).end(); // Method Not Allowed
  }
}
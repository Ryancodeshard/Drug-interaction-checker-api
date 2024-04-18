import drugInfo from "@/interfaces/drugInfo";

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

export default parseText
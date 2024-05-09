import drugInfo from "@/interfaces/drugInfo";
const BASE_URL = "https://api.openai.com/v1/chat/completions"

const getDrugNames = async (medNames: string[])=>{
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
              "content": "You are a medical assistant that takes in a list of commercial medication names e.g. [Panadol, Coumadin], give a json mapping of commercial name to list of drugnames {medName: [drugNames, string[] of component chemicals]} e.g. {Panadol: [Paracetemol], Coumadin: [Warfarin]}"
          },
          {
              "role": "user",
              "content": medNames.toString(),
          }
      ],
      "max_tokens": 300
  })
  });

    const response = await interactions.json() 
    console.log(response.choices[0].message.content)
    return response.choices[0].message.content
}

export default getDrugNames
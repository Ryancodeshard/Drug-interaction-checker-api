import drugInfo from "@/interfaces/drugInfo";
const BASE_URL = "https://api.openai.com/v1/chat/completions"

const getRemarks = async (query:string):Promise<drugInfo>=>{
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
              "content": "You are a medical assistant that takes in json e.g. {level:Moderate,drugA:Amoxicillin,drugB:Warfarin} describing interactions between two drugs. Give some reccomendations in a list of strings for the level given. (100 words max)"
          },
          {
              "role": "user",
              "content": query,
          }
      ]
  })
  });

    const response = await interactions.json() 
    console.log(response.choices[0].message.content)
    return response.choices[0].message.content
}

export default getRemarks
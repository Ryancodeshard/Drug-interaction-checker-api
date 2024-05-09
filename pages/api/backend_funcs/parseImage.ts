import drugInfo from "@/interfaces/drugInfo";

const BASE_URL = "https://api.openai.com/v1/chat/completions"

const parseImage = async (image:string):Promise<drugInfo>=>{
  // Handle POST request
  // Example: Accessing POST data
  const interactions = await fetch(BASE_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(
      {
        "model": "gpt-4-turbo",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "Take in prescription text, parse the text (get base drug name(s)) extract in json: {medName: string of original commercial name,dosage: calculated integer of tablets/amount in ml for each time a day,timesPerDay: a calculated integer for times to take each day, beforeMeal: boolean, remarks: string} e.g. {medName:Panadol,timesPerDay:3,dosage:20ml,remarks:Do not take with alcohol} e.g. {medName:Panadol,timesPerDay:1,dosage:1 tablet,remarks:Take with diphenhydramine for headache}"
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": image
                }
              }
            ]
          }
        ],
        "response_format": {
                "type": "json_object"
            },
        "max_tokens": 300
      }
)
});

  const response = await interactions.json() 
  console.log(response.choices[0].message.content)
  return JSON.parse(response.choices[0].message.content)
}

export default parseImage
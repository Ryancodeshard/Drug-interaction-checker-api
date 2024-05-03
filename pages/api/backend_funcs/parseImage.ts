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
                "text": "Take in prescription text, parse the text (get base drug name(s)) extract in json: {medName: string of original commercial name,drugNames: string[] of component chemicals,dosage: number of tablets/amount in ml,timesPerDay: number, beforeMeal: boolean, remarks: string} e.g. {medName:Panadol,drugNames:[Acetaminophen],dosage:20ml,timesPerDay:1,beforeMeal:false,remarks:Do not take with alcohol} e.g. {medName:Panadol,drugNames:[Acetaminophen],dosage:1 tablet,timesPerDay:1,beforeMeal:false,remakrs:Take with diphenhydramine for headache}"
              },
              // {
              //   "type": "image_url",
              //   "image_url": {
              //     "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaPn7jre1O6ny8VHB1yBEySYSlmJgZrJ3dc3xwkqKfvw&s"
              //   }
              // }
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
import db_handler from "../db_handler"
import getRemarks from "./getRemarks"

const getDrugInteractions=async(drug_map:{[drugName:string]:string})=>{
  console.log(drug_map)
  const drug_levels:any[] = []
  const drugs = Object.keys(drug_map)
  for (let i=0;i<drugs.length-1;i++){
    for (let j=i+1;j<drugs.length;j++){
      const drugA=drugs[i]
      const drugB=drugs[j]
      console.log("Checking for:",drugA,drugB)
      const responseBody = await db_handler(`
        SELECT * FROM drug_interactions WHERE (drug_a = '${drugA}' AND drug_b = '${drugB}') OR (drug_a = '${drugB}' AND drug_b = '${drugA}');
      `)

      if (responseBody.rows.length>=1){
        const doc = responseBody.rows[0]
        console.log("Interaction found btwn",drugA,drugB)
        const remarks = await getRemarks(JSON.stringify({level:doc.level,drugA:drugA,drugB:drugB}))
        drug_levels.push({level:doc.level,drugA:drug_map[drugA],drugB:drug_map[drugB],remarks:remarks})
      }
    }
  }
  return drug_levels;
}

export default getDrugInteractions
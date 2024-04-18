import { db } from "@/db/firebaseConfig"
import { query, collection, where, getDocs } from "firebase/firestore"
import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
ssl: true
});

//DO NOT TOUCH THIS FUNCTION
const handler = async(req: string): Promise<QueryResult<any>> => {
  const client = await pool.connect();
  // req = req.replaceAll('"', "'") // replace all double quotes with single
  console.log(req)
  const response = await client.query(req);
  client.release();
  return response
}

const getDrugInteractions=async(drug_map:{[drugName:string]:string})=>{
  console.log(drug_map)
  const drug_levels:any[] = []
  const drugs = Object.keys(drug_map)
  for (let i=0;i<drugs.length-1;i++){
    for (let j=i+1;j<drugs.length;j++){
      const drugA=drugs[i]
      const drugB=drugs[j]
      console.log("Checking for:",drugA,drugB)
      const responseBody = await handler(`
        SELECT * FROM drug_interactions WHERE (drug_a = '${drugA}' AND drug_b = '${drugB}') OR (drug_a = '${drugB}' AND drug_b = '${drugA}');
      `)

      for (let i=0;i<responseBody.rows.length;i++){
        const doc = responseBody.rows[i]
        drug_levels.push([doc.level,drug_map[drugA],drug_map[drugB]])
      }
    }
  }
  return drug_levels;
  
}

export default getDrugInteractions
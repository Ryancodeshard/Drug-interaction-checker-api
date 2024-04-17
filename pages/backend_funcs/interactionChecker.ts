import { db } from "@/db/firebaseConfig"
import { query, collection, where, getDocs } from "firebase/firestore"

const getDrugInteractions=async(drug_map:{[drugName:string]:string})=>{
  console.log(drug_map)
  const drug_levels:any[] = []
  const drugs = Object.keys(drug_map)
  for (let i=0;i<drugs.length-1;i++){
    for (let j=i+1;j<drugs.length;j++){
      const drugA=drugs[i]
      const drugB=drugs[j]
      console.log(drugA,drugB)
      const q = query(collection(db, "drug_interactions"), where("drugA", "==", drugA));
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot)
      for (let i=0;i<querySnapshot.docs.length;i++){
        const doc = querySnapshot.docs[i]
        console.log(doc.id, " => ", doc.data());
        console.log(doc.data().Level)
        drug_levels.push(doc.data().Level,drug_map[drugA],drug_map[drugB])
      }
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      //   console.log(doc.data().Level)
      //   drug_levels.push(doc.data().Level,drug_map[drugA],drug_map[drugB])
      // });
    }
  }
  return drug_levels;
  
}

export default getDrugInteractions
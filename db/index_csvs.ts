// Import the Firebase SDK
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import * as fs from 'fs';
import csvParser from 'csv-parser';

// Function to create collections and documents
async function createFirestoreData() {
  const filePathBase = "indexed_data/ddinter_downloads_code_";
  const ends = ['A','B','D','H','L','P','R','V'];

  for (let i = 0; i < ends.length; i++) {
    const filePath = filePathBase + ends[i] + '.csv';
    try {
      const readStream = fs.createReadStream(filePath);
      await new Promise<void>((resolve, reject) => {
        readStream.pipe(csvParser())
          .on('data', async (row: any) => {
            try {
              const drugInteractionsCollection = collection(db, 'drug_interactions');
              await addDoc(drugInteractionsCollection, {
                drugA: row.Drug_A,
                drugB: row.Drug_B,
                level: row.Level,
              });
            } catch (error) {
              console.error('Error adding document to Firestore:', error);
            }
          })
          .on('end', () => {
            console.log(`CSV file ${filePath} successfully imported into Firestore`);
            resolve(); // Resolve the promise when the CSV file is processed
          })
          .on('error', (error: any) => {
            console.error('Error reading CSV file:', error);
            reject(error); // Reject the promise if there's an error
          });
      });
    } catch (error) {
      console.error('Error reading CSV file:', error);
    }
  }
}

// Call the function to create Firestore data
createFirestoreData();

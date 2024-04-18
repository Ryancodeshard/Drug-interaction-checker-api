import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
ssl: true
});

//DO NOT TOUCH THIS FUNCTION
const db_handler = async(req: string): Promise<QueryResult<any>> => {
  const client = await pool.connect();
  // req = req.replaceAll('"', "'") // replace all double quotes with single
  console.log(req)
  const response = await client.query(req);
  client.release();
  return response
}

export default db_handler
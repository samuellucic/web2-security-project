import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const db = {
  query: async (text: string, params?: any[]) => {
    try {
      const queryResults = (await pool.query(text, params)) as
        | QueryResult[]
        | QueryResult;
      if (Array.isArray(queryResults)) {
        return queryResults[queryResults.length - 1].rows;
      }
      return queryResults.rows;
    } catch (err: any) {
      return [err.message];
    }
  },
};

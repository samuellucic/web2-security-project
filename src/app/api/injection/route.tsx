import { SQLInjectionProps } from '../../Types';
import { db } from '../../db';

export const POST = async (request: Request) => {
  const sqlInjectionRequestBody: SQLInjectionProps = await request.json();
  const bills = await getBills(sqlInjectionRequestBody);

  return new Response(JSON.stringify(bills));
};

const getBills = async ({
  username,
  password,
  vulnerable,
}: SQLInjectionProps) => {
  if (vulnerable) {
    if (checkIllegalQueries(username) || checkIllegalQueries(password)) {
      return ['Not allowed!'];
    }

    return await db.query(`
      SELECT bills.* 
        FROM users NATURAL JOIN bills
       WHERE username = '${username}' AND password = '${password}'
       ;`);
  }
  return await db.query(
    `
      SELECT bills.* 
        FROM users NATURAL JOIN bills
       WHERE username = $1 AND password = $2;
    `,
    [username, password]
  );
};

const checkIllegalQueries = (text: string): boolean => {
  const sanitized = text.toLowerCase().replaceAll(/\s+/g, ' ');

  return (
    sanitized.includes('delete from') ||
    sanitized.includes('drop ') ||
    sanitized.includes('drop ') ||
    sanitized.includes('update ')
  );
};

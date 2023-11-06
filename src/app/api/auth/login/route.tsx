import { compareSync } from 'bcrypt';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { sessions } from '../../session';
import { db } from '../../../db';

export interface User {
  id: string;
  username: string;
}

export const POST = async (request: Request) => {
  const { username, password, vulnerable } = await request.json();

  const dbPassword: string = (
    await db.query('SELECT password FROM users_ba WHERE username = $1', [
      username,
    ])
  )[0]?.password;
  if (!dbPassword) {
    const error = {
      message: vulnerable
        ? 'Korisničko ime ne postoji'
        : 'Krivi podatci za prijavu',
      status: 401,
    };
    return new Response(JSON.stringify(error), {
      status: 401,
    });
  }
  if (!compareSync(password, dbPassword)) {
    const error = {
      message: vulnerable ? 'Pogrešna lozinka' : 'Krivi podatci za prijavu',
      status: 401,
    };
    return new Response(JSON.stringify(error), {
      status: 401,
    });
  }

  const id = randomUUID();

  const sessionId = cookies().get('session')?.value;
  const session = sessionId
    ? sessions.find((session) => session.id === sessionId)
    : undefined;
  if (session) {
    session.id = id;
    session.expirationDate = createNewExpDate();
  } else {
    const expirationDate = createNewExpDate();
    sessions.push({ username, id, expirationDate });
  }

  cookies().set('session', id!, {
    httpOnly: !vulnerable,
  });

  return new Response();
};

const createNewExpDate = () => {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1);
  return expirationDate;
};

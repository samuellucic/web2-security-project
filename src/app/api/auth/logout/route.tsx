import { cookies } from 'next/headers';
import { sessions } from '../../session';

export const GET = (request: Request) => {
  const sessionId = cookies().get('session')?.value;

  if (sessionId) {
    cookies().delete('session');

    const sessionIndex = sessions.findIndex(
      (session) => session.id === sessionId
    );
    sessions.splice(sessionIndex, 1);
  }
  return new Response(null, {
    status: 200,
  });
};

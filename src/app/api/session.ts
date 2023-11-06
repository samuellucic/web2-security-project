export interface Session {
  id: string;
  username: string;
  expirationDate: Date;
}

export const sessions: Session[] = [];

setInterval(
  () => {
    const dateNow = new Date();

    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].expirationDate <= dateNow) {
        sessions.splice(i, 1);
      }
    }
  },
  60 * 60 * 1000
);

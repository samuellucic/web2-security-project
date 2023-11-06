import { db } from './index';

(async () => {
  await db.query(`
  CREATE TABLE IF NOT EXISTS users (
      userId SERIAL PRIMARY KEY,
      username VARCHAR(50),
      password VARCHAR(50)
  );`);
  await db.query(`
  CREATE TABLE IF NOT EXISTS bills (
      billId SERIAL PRIMARY KEY,
      amount FLOAT,
      description VARCHAR(50),
      billDate TIMESTAMP,
      userId SERIAL REFERENCES users(userId)
  );`);
  await db.query(`
  INSERT INTO users (username, password) VALUES
      ('user', 'user'),
      ('user2', 'user2'),
      ('fake_user', 'fake_user');`);
  await db.query(`
  INSERT INTO bills (amount, billDate, description, userId) VALUES
      (100, NOW(), 'Struja', 1),
      (200, NOW(), 'Vodovod', 1),
      (300, NOW(), 'Polog', 1),
      (400, NOW(), 'Pričuva', 1),
      (500, NOW(), 'Gospodarenje otpadom', 2),
      (600, NOW(), 'Kredit', 2),
      (700, NOW(), 'Rata za auto', 2),
      (800, NOW(), 'Rata za mobitel', 2),
      (900, NOW(), 'Struja', 3),
      (1000, NOW(), 'HRT', 3),
      (1100, NOW(), 'Internet', 3),
      (1200, NOW(), 'Obrada troškova upisa na diplomski', 3);`);
  await db.query(`
  CREATE TABLE IF NOT EXISTS users_ba (
      username VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255)
  );`);
  await db.query(`
  INSERT INTO users_ba VALUES 
   ('korisnik_s_ovlastima', '$2b$08$4FHJZMflIi8.EUZgK7F2cOxQaGu4YfHrr4U/eFve83MV0uZPIF4km');
`);
})();

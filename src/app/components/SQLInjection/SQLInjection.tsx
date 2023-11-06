import Vulnerability from '../Vulnerability/Vulnerability';
import styles from './SQLInjection.module.css';
import { FormEventHandler, useState } from 'react';
import { SQLInjectionProps } from '../../Types';
import useFormInput from '../../hooks/useFormInput';

const instructions = (
  <span>
    Podržavana je tautologija, ilegalni upiti, union upit, <br />
    Ne dopuštam nijedan DROP i DELETE upit jer ne želim ostati bez baze :).{' '}
    <br />
    Ne dopuštam ni INSERT. <br />
    Ovaj primjer će prikazati sve račune od korisnika koji uspješno upiše svoje
    korisničko ime i lozinku. <br />
    <b>
      Validna prijava korisničko ime: <i>user</i>, lozinka: <i>user</i>
    </b>{' '}
    <br />
    SQL upit u bazu glasi: &apos;SELECT bills.* FROM users NATURAL JOIN bills
    WHERE username = :username AND password = :password;. <br />
    Lozinke su namjerno pohranjene u običnom tekstu, a ne u sažetcima. <br />
    S checkboxom ubacivanje se uključi ili isključi. <br />
    <br />
    Tautologija: &apos; OR 1=1; -- <br />
    Ilegalni upiti: 1&apos; ORDER BY 6 -- <br />
    Union upit: &apos; UNION SELECT 0, 0, username || &apos; &apos; || password,
    &apos;2023-1-1&apos;::TIMESTAMP, 0 from users-- <br />
  </span>
);

export const SQLInjection = () => {
  const [vulnerable, setVulnerable] = useState<boolean>(true);
  const [username, handleUsernameChange] = useFormInput({ initialValue: '' });
  const [password, handlePasswordChange] = useFormInput({ initialValue: '' });
  const [results, setResults] = useState<string[]>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const sqlInjectionRequestBody: SQLInjectionProps = {
      username,
      password,
      vulnerable,
    };

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/injection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sqlInjectionRequestBody),
    })
      .then((res) => res.json())
      .then((data: any[]) => {
        if (data.length < 1) {
          setResults(['Nema rezultata.']);
        } else {
          setResults(data.map((value) => JSON.stringify(value)));
        }
      });
  };

  return (
    <Vulnerability
      title={'SQL ubacivanje (SQL Injection)'}
      instructions={instructions}>
      <form
        className={styles['form-container']}
        method="POST"
        onSubmit={handleSubmit}>
        <div className={styles['input-container']}>
          <label htmlFor="injection-username">Korisničko ime: </label>
          <input
            type="text"
            id="injection-username"
            name="injection-username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className={styles['input-container']}>
          <label htmlFor="injection-password">Lozinka: </label>
          <input
            type="password"
            id="injection-password"
            name="injection-password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className={styles.checkbox}>
          <label htmlFor="injection-checkbox">Ranjivost uključena</label>
          <input
            id="injection-checkbox"
            name="injection-checkbox"
            type="checkbox"
            checked={vulnerable}
            onChange={() => setVulnerable((checked) => !checked)}
          />
        </div>
        <div className={styles['button-container']}>
          <button type="submit">Dohvati račune</button>
        </div>
        <div className={styles['results-container']}>
          {results?.map((result, index) => (
            <p key={index} className={styles.message}>
              {result}
            </p>
          ))}
        </div>
      </form>
    </Vulnerability>
  );
};

export default SQLInjection;

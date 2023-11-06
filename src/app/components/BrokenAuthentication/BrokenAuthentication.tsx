import Vulnerability from '../Vulnerability/Vulnerability';
import styles from '../SQLInjection/SQLInjection.module.css';
import { FormEventHandler, useState } from 'react';
import useFormInput from '../../hooks/useFormInput';
import { LoginProps } from '../../Types';

const instructions = (
  <span>
    Loša autentifikacija demonstrirat će loše poruke o greškama prilikom prijave
    <br />i krivo postavljene identifikatore sjednice kojima se može pristupiti
    iz Javascript koda. <br />
    <br />
    Pokušajte se prijaviti s krivim korisničkim imenom ili krivom lozinkom.
    <br />
    Korisničko ime:{' '}
    <b>
      <i>korisnik_s_ovlastima</i>
    </b>
    <br />
    Lozinka:{' '}
    <b>
      <i>dovoljnoDugaLozinka123</i>
    </b>
    <br />S checkboxom loša autentifikacija se uključi ili isključi.
  </span>
);

const BrokenAuthentication = () => {
  const [vulnerable, setVulnerable] = useState<boolean>(true);
  const [username, handleUsernameChange] = useFormInput({ initialValue: '' });
  const [password, handlePasswordChange] = useFormInput({ initialValue: '' });
  const [error, setError] = useState<string>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [session, setSession] = useState<string>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const loginRequestBody: LoginProps = {
      username,
      password,
      vulnerable,
    };

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(loginRequestBody),
    })
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        const data = text ? JSON.parse(text) : {};
        if (data.status === 401) {
          setError(data.message);
          return;
        }

        const sessionId: string | undefined = document.cookie
          .split(';')
          .find((cookie) => cookie.startsWith('session'))
          ?.split('=')[1];
        setSession(sessionId);

        setLoggedIn(true);
        setError(undefined);
      });
  };

  const handleLogout = () => {
    setSession(undefined);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/logout`).then((res) => {
      setLoggedIn(false);
    });
  };

  return (
    <Vulnerability
      title={'Loša autentifikacija (Broken Authentication)'}
      instructions={instructions}>
      {loggedIn ? (
        <div className={styles['logged-in']}>
          <p>
            Identifikator sjednice: {session ? session : 'nemoguće dohvatiti'}
          </p>
          <div className={styles['button-container']}>
            <button onClick={handleLogout}>Odjavi se</button>
          </div>
        </div>
      ) : (
        <form
          className={styles['form-container']}
          method="POST"
          onSubmit={handleSubmit}>
          <div className={styles['input-container']}>
            <label htmlFor="auth-username">Korisničko ime: </label>
            <input
              type="text"
              id="auth-username"
              name="auth-username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className={styles['input-container']}>
            <label htmlFor="auth-password">Lozinka: </label>
            <input
              type="password"
              id="auth-password"
              name="auth-password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className={styles.checkbox}>
            <label htmlFor="auth-checkbox">Ranjivost uključena</label>
            <input
              id="auth-checkbox"
              name="auth-checkbox"
              type="checkbox"
              checked={vulnerable}
              onChange={() => setVulnerable((checked) => !checked)}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles['button-container']}>
            <button type="submit">Prijavi se</button>
          </div>
        </form>
      )}
    </Vulnerability>
  );
};

export default BrokenAuthentication;

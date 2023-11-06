'use client';

import styles from './page.module.css';
import SQLInjection from './components/SQLInjection/SQLInjection';
import { useState } from 'react';
import BrokenAuthentication from './components/BrokenAuthentication/BrokenAuthentication';

export default function Home() {
  const [vulnerabilityIndex, setVulnerabilityIndex] = useState<number>(0);

  return (
    <>
      <header className={styles.header}>
        <h1>Drugi projekt: Sigurnost</h1>
      </header>
      <div className={styles.tabs}>
        <h2
          className={`${styles.tab} ${
            vulnerabilityIndex === 0 ? styles.underlined : undefined
          }`}
          onClick={() => setVulnerabilityIndex(0)}>
          SQL ubacivanje
        </h2>
        <h2
          className={`${styles.tab} ${
            vulnerabilityIndex === 1 ? styles.underlined : undefined
          }`}
          onClick={() => setVulnerabilityIndex(1)}>
          Loša autentifikacija
        </h2>
      </div>
      <main className={styles.main}>
        {vulnerabilityIndex === 0 && <SQLInjection />}
        {vulnerabilityIndex === 1 && <BrokenAuthentication />}
      </main>
    </>
  );
}

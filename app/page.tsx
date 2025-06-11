// app/page.tsx eller hvor du har din komponent
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Alt til studiet samlet i én platform</h1>
      <p className={styles.subtitle}>Slip for kaos – saml dine noter ét sted</p>
    </main>
  );
}

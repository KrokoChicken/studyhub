import SubjectList from "@/components/SubjectList/SubjectList";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <main className={styles.container}>
      <div className={styles.sidebar}>
        <SubjectList />
      </div>

      <div className={styles.content}></div>
    </main>
  );
}

"use client";

import { useState } from "react";
import styles from "./SubjectList.module.css";
import { useSubjects } from "@/lib/hooks/useSubjects";
import Link from "next/link";

export default function SubjectList() {
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const { subjects, addSubject, loading, error } = useSubjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSubject(newSubject);
    setNewSubject("");
    setShowModal(false);
  };

  return (
    <div className={styles.subjectContainer}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h2>Dine fag</h2>
          <button
            onClick={() => setShowModal(true)}
            className={styles.addButton}
          >
            +
          </button>
        </div>

        {loading ? (
          <p>Indlæser...</p>
        ) : (
          <ul className={styles.subjectList}>
            {subjects.map((subject: any) => (
              <li key={subject.id} className={styles.subjectItem}>
                <Link
                  href={`/subjects/${subject.id}`}
                  className={styles.subjectLink}
                >
                  {subject.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Tilføj fag</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Fx Matematik"
                className={styles.input}
                required
              />
              <div className={styles.modalActions}>
                <button type="submit" className={styles.button}>
                  Gem
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancel}
                >
                  Annuller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

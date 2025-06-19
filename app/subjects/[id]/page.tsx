"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import debounce from "lodash.debounce";
import TiptapEditor from "@/components/TiptapEditor/TiptapEditor";
import styles from "./page.module.css";

export default function SubjectPage() {
  const { id: subjectId } = useParams();
  const [subjectName, setSubjectName] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [newTopic, setNewTopic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState(false);

  // Debounced save function ref
  const debouncedSave = useRef(
    debounce(async (topicId: string, content: string) => {
      await fetch("/api/topics/updateNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, content }),
      });
    }, 5000) // 5000ms = 5 seconds
  ).current;

  // Fetch subject and topic list
  useEffect(() => {
    const fetchTopics = async () => {
      const res = await fetch(`/api/subjects/${subjectId}/topics`);
      const data = await res.json();
      setSubjectName(data.name);
      setTopics(data.topics);
    };
    fetchTopics();
  }, [subjectId]);

  // Fetch full topic with note when a topic is selected
  const handleSelectTopic = async (topic: any) => {
    setLoadingTopic(true);
    setSelectedTopic(null);

    const res = await fetch(`/api/topics/${topic.id}`);
    const data = await res.json();

    setSelectedTopic(data);
    setLoadingTopic(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/topics/add", {
      method: "POST",
      body: JSON.stringify({ name: newTopic, subjectId }),
      headers: { "Content-Type": "application/json" },
    });
    setNewTopic("");
    setShowModal(false);

    const res = await fetch(`/api/subjects/${subjectId}/topics`);
    const data = await res.json();
    setSubjectName(data.name);
    setTopics(data.topics);
  };

  // Pass this to TiptapEditor as onChange to debounce saves
  const handleNoteSave = (content: string) => {
    if (!selectedTopic) return;
    debouncedSave(selectedTopic.id, content);
  };

  return (
    <div className={styles.pageLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2>{subjectName}</h2>
        <ul className={styles.topicList}>
          {topics.map((topic: any) => (
            <li
              key={topic.id}
              className={styles.topicItem}
              onClick={() => handleSelectTopic(topic)}
              style={{
                backgroundColor:
                  selectedTopic?.id === topic.id ? "#cbd5ff" : undefined,
                cursor: "pointer",
              }}
            >
              {topic.name}
            </li>
          ))}
        </ul>
        <button onClick={() => setShowModal(true)} className={styles.addButton}>
          + Tilføj emne
        </button>
      </aside>

      {/* Content */}
      <section className={styles.content}>
        {loadingTopic ? (
          <p>Indlæser emne...</p>
        ) : selectedTopic ? (
          <>
            <h1>{selectedTopic.name}</h1>
            <TiptapEditor
              content={selectedTopic.note || ""}
              onChange={handleNoteSave}
            />
          </>
        ) : (
          <p>Vælg et emne for at se indhold</p>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Nyt emne</h2>
            <form onSubmit={handleAdd} className={styles.form}>
              <input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Skriv emnenavn"
                required
                className={styles.input}
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

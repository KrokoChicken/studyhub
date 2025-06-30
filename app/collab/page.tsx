"use client";

import { useState } from "react";
import CollaborativeEditor from "@/components/CollaborativeEditor/CollaborativeEditor";

export default function CollabPage() {
  // Generate a username once per session (you could also pull from auth)
  const [userName] = useState(() => `User${Math.floor(Math.random() * 10000)}`);

  const [roomId, setRoomId] = useState("");
  const [inputRoomId, setInputRoomId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  async function createCollabNote() {
    if (!newTitle.trim()) {
      alert("Please enter a title");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/collabNotes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // TODO: Replace 1 with actual user ID from auth/session
        body: JSON.stringify({ title: newTitle.trim(), createdByUserId: 1 }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to create note: ${errText}`);
      }

      const data = await res.json();
      setRoomId(data.note.roomId);
      setNewTitle("");
    } catch (error) {
      alert("Error creating note, check console");
      console.error(error);
    } finally {
      setCreating(false);
    }
  }

  function joinRoom() {
    if (inputRoomId.trim()) {
      setRoomId(inputRoomId.trim());
    }
  }

  function leaveRoom() {
    setRoomId("");
    setInputRoomId("");
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      {!roomId ? (
        <>
          <h1>Collaborative Notes</h1>

          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="New Note Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 6,
                border: "1.5px solid #ccc",
                marginRight: 8,
                fontSize: "1rem",
                width: "60%",
              }}
              disabled={creating}
            />
            <button
              onClick={createCollabNote}
              disabled={creating}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                cursor: creating ? "not-allowed" : "pointer",
                fontWeight: "600",
              }}
            >
              {creating ? "Creating..." : "Create Collaborative Note"}
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <input
              type="text"
              placeholder="Enter Room ID to Join"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 6,
                border: "1.5px solid #ccc",
                marginRight: 8,
                fontSize: "1rem",
                width: "60%",
              }}
            />
            <button
              onClick={joinRoom}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 6,
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Join Room
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Room ID: {roomId}</h2>
            <button
              onClick={leaveRoom}
              style={{
                padding: "0.3rem 0.7rem",
                borderRadius: 6,
                border: "1px solid #2563eb",
                backgroundColor: "white",
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "600",
                height: "fit-content",
              }}
            >
              Leave Room
            </button>
          </div>

          <p>Share this room ID to collaborate with others.</p>

          <CollaborativeEditor roomId={roomId} userName={userName} />
        </>
      )}
    </div>
  );
}

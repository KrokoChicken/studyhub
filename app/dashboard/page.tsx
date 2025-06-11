"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Indlæser...</p>;
  }

  if (!session) {
    return <p>Du skal være logget ind for at se dette indhold.</p>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>
        Velkommen til dit dashboard, {session.user?.name || session.user?.email}
        !
      </h1>
      <p>Her kan du begynde at bruge StudyHub 🧠</p>
    </main>
  );
}

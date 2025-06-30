"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Buffer } from "buffer";

export default function CollaborativeEditor({
  roomId,
  userName,
}: {
  roomId: string;
  userName: string;
}) {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [isDocReady, setIsDocReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const doc = new Y.Doc();

    async function loadDoc() {
      try {
        const res = await fetch(`/api/collabNotes/${roomId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        if (data.note?.ydocState) {
          const buffer = Buffer.from(data.note.ydocState, "base64");
          Y.applyUpdate(doc, buffer);
        }
      } catch (e) {
        console.error("Error loading doc", e);
        return;
      }

      const frag = doc.getXmlFragment("prosemirror");
      const firstChild = frag.get(0);

      if (
        !(firstChild instanceof Y.XmlElement) ||
        firstChild.nodeName !== "doc"
      ) {
        frag.delete(0, frag.length);
        const docNode = new Y.XmlElement("doc");
        const paraNode = new Y.XmlElement("paragraph");
        docNode.push([paraNode]);
        frag.push([docNode]);
      }

      setYdoc(doc);
      setIsDocReady(true);
    }

    loadDoc();

    return () => {
      doc.destroy();
      setYdoc(null);
      setIsDocReady(false);
    };
  }, [roomId]);

  useEffect(() => {
    if (!ydoc || !isDocReady || !roomId) return;

    const wsProvider = new WebsocketProvider(
      "ws://localhost:1234",
      roomId,
      ydoc
    );

    wsProvider.awareness.setLocalStateField("user", {
      name: userName,
      color:
        "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0"),
    });

    setProvider(wsProvider);

    return () => {
      wsProvider.disconnect();
      setProvider(null);
    };
  }, [ydoc, isDocReady, roomId, userName]);

  const editor = useEditor(
    isClient && provider && ydoc && isDocReady
      ? {
          extensions: [
            StarterKit.configure({ history: false }),
            Collaboration.configure({ document: ydoc, field: "prosemirror" }),
            CollaborationCursor.configure({ provider }),
          ],
          immediatelyRender: false, // <-- important to avoid SSR hydration mismatch
        }
      : undefined
  );

  useEffect(() => {
    if (!ydoc) return;

    const saveDoc = debounce(() => {
      try {
        const update = Y.encodeStateAsUpdate(ydoc);
        const base64 = Buffer.from(update).toString("base64");
        fetch("/api/collabNotes/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, ydocStateBase64: base64 }),
        });
      } catch (e) {
        console.error("Failed to save doc", e);
      }
    }, 2000);

    ydoc.on("update", saveDoc);

    return () => {
      ydoc.off("update", saveDoc);
      saveDoc.cancel();
    };
  }, [ydoc, roomId]);

  if (!isClient) return <div>Loading client...</div>;
  if (!editor) return <div>Loading editor...</div>;

  return <EditorContent editor={editor} />;
}

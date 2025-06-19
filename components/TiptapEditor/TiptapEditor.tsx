"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "../extensions/Image";
import { CustomTextStyle } from "../CustomTextStyle";
import { uploadToSupabase } from "@/lib/uploadtoSupabase";
import { useEffect } from "react";
import styles from "./TiptapEditor.module.css";

type Props = {
  content: string;
  onChange: (html: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    content,
    extensions: [StarterKit, Image, CustomTextStyle],
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none max-w-full min-h-[400px]",
      },
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const file = items
          .find((item) => item.type.includes("image"))
          ?.getAsFile();

        if (file) {
          uploadToSupabase(file).then((url) => {
            editor
              ?.chain()
              .focus()
              .setImage({ src: url, alt: file.name, width: "400" })
              .run();
          });
          return true;
        }

        return false;
      },
      handleDrop(view, event) {
        const file = Array.from(event.dataTransfer?.files || []).find((f) =>
          f.type.includes("image")
        );

        if (file) {
          uploadToSupabase(file).then((url) => {
            editor
              ?.chain()
              .focus()
              .setImage({ src: url, alt: file.name, width: "400" })
              .run();
          });
          return true;
        }

        return false;
      },
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? styles.active : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? styles.active : ""}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? styles.active : ""}
        >
          Strike
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setCustomTextStyle({ fontSize: "20px" })
              .run()
          }
        >
          Font 20px
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setCustomTextStyle({ fontFamily: "monospace" })
              .run()
          }
        >
          Monospace
        </button>
        <button
          onClick={() => editor.chain().focus().unsetCustomTextStyle().run()}
        >
          Clear Style
        </button>
      </div>

      {/* Editable Content */}
      <EditorContent editor={editor} className={styles.editor} />
    </>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "../extensions/Image"; // Custom Image extension
import { CustomTextStyle } from "../extensions/CustomTextStyles"; // Custom text style extension
import DropCursor from "../extensions/DropCursor"; // Drop cursor extension for drag & drop visual
import { uploadToSupabase } from "@/lib/uploadtoSupabase"; // Function to upload images to Supabase storage
import { useEffect } from "react";
import styles from "./TiptapEditor.module.css";

// Predefined font sizes and families for the dropdown menus
const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
];
const FONT_FAMILIES = [
  "Arial",
  "Georgia",
  "Tahoma",
  "Times New Roman",
  "Verdana",
  "monospace",
];

// Props for this component
type Props = {
  content: string; // HTML content to load into editor
  onChange: (html: string) => void; // Callback when content changes
};

export default function TiptapEditor({ content, onChange }: Props) {
  // Initialize the Tiptap editor with extensions and handlers
  const editor = useEditor({
    content, // initial content
    extensions: [StarterKit, Image, CustomTextStyle, DropCursor], // loaded extensions
    onUpdate({ editor }) {
      // When editor content updates, call the onChange prop with new HTML
      onChange(editor.getHTML());
    },
    editorProps: {
      // Add class to the editable area for styling
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none max-w-full min-h-[400px]",
      },

      // Handle pasting images into the editor
      handlePaste(view, event) {
        // Extract items from clipboard data
        const items = Array.from(event.clipboardData?.items || []);
        // Find the first image file, if any
        const file =
          items.find((item) => item.type.includes("image"))?.getAsFile() ??
          undefined;

        if (file) {
          // Upload image file to Supabase storage
          uploadToSupabase(file).then((url) => {
            if (url && editor) {
              // Insert image into the editor when upload succeeds
              editor
                .chain()
                .focus()
                .setImage({ src: url, alt: file.name, width: "400" })
                .run();
            }
          });
          return true; // indicate we handled this event
        }
        return false; // not an image, let default happen
      },

      // Handle dropping images into the editor
      handleDrop(view, event) {
        // Extract image files from the dropped data
        const file =
          Array.from(event.dataTransfer?.files || []).find((f) =>
            f.type.includes("image")
          ) ?? undefined;

        if (file) {
          // Upload dropped image file to Supabase storage
          uploadToSupabase(file).then((url) => {
            if (url && editor) {
              // Insert image into the editor when upload succeeds
              editor
                .chain()
                .focus()
                .setImage({ src: url, alt: file.name, width: "400" })
                .run();
            }
          });
          return true; // handled drop event
        }
        return false; // not an image, allow default
      },
    },
  });

  // Sync editor content if the `content` prop changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Render nothing if editor is not ready yet
  if (!editor) return null;

  return (
    <>
      {/* Toolbar with formatting buttons and font selectors */}
      <div className={styles.toolbar}>
        {/* Basic formatting buttons */}
        <div className={styles.group}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? styles.active : ""}
            title="Bold (Ctrl+B)"
          >
            <b>B</b>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? styles.active : ""}
            title="Italic (Ctrl+I)"
          >
            <i>I</i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? styles.active : ""}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        {/* Font size selector */}
        <select
          className={styles.select}
          value={editor.getAttributes("customTextStyle").fontSize || ""}
          onChange={(e) => {
            const fontSize = e.target.value || null;
            if (fontSize) {
              editor.chain().focus().setCustomTextStyle({ fontSize }).run();
            } else {
              editor.chain().focus().unsetCustomTextStyle().run();
            }
          }}
          title="Font Size"
        >
          <option value="">Font Size</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {/* Font family selector */}
        <select
          className={styles.select}
          value={editor.getAttributes("customTextStyle").fontFamily || ""}
          onChange={(e) => {
            const fontFamily = e.target.value || null;
            if (fontFamily) {
              editor.chain().focus().setCustomTextStyle({ fontFamily }).run();
            } else {
              editor.chain().focus().unsetCustomTextStyle().run();
            }
          }}
          title="Font Family"
        >
          <option value="">Font Family</option>
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        {/* Clear all custom text styles */}
        <button
          onClick={() => editor.chain().focus().unsetCustomTextStyle().run()}
          title="Clear Formatting"
        >
          ✖
        </button>
      </div>

      {/* The editable content area */}
      <EditorContent editor={editor} className={styles.editor} />
    </>
  );
}

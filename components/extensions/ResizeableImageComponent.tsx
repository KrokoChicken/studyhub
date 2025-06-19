/*
import React, { useState, useEffect, useRef } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import styles from "./ResizeableImageComponent.module.css";

const ResizableImageComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const { src, width = 300, height } = node.attrs;
  const [imgWidth, setImgWidth] = useState<number>(width);
  const [imgHeight, setImgHeight] = useState<number | "auto">(height || "auto");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgWidth(width);
    setImgHeight(height || "auto");
  }, [width, height]);

  // Simple corner resize keeping aspect ratio locked
  const onResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = imgWidth;
    const aspectRatio =
      imgWidth / (typeof imgHeight === "number" ? imgHeight : imgWidth);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newWidth = Math.max(50, startWidth + deltaX);
      let newHeight = newWidth / aspectRatio;
      setImgWidth(newWidth);
      setImgHeight(newHeight);
      updateAttributes({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (!src) return null;

  return (
    <NodeViewWrapper
      className={`${styles["resizable-image-wrapper"]} ${
        selected ? styles.selected : ""
      }`}
      style={{
        display: "inline-block",
        position: "relative",
        width: imgWidth,
        height: imgHeight === "auto" ? "auto" : imgHeight,
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt=""
        width={imgWidth}
        height={imgHeight === "auto" ? undefined : imgHeight}
        style={{
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
          maxWidth: "100%",
        }}
      />
      {selected && (
        <div
          className={styles["resize-handle"]}
          onMouseDown={onResize}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            backgroundColor: "#2563eb",
            cursor: "nwse-resize",
            borderRadius: 4,
            userSelect: "none",
            zIndex: 10,
          }}
        />
      )}
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;
*/

import React, { useState } from "react";
import { Stage, Layer, Rect, Line, Text, Group } from "react-konva";
import simplify from "simplify-js";

const CATEGORY_FIELDS = {
  Instrument: [{ name: "Tag No", key: "tagNo" }],
  Valve: [
    { name: "Tag No", key: "tagNo" },
    { name: "Size", key: "size" },
    { name: "Type", key: "type" },
    { name: "Operation", key: "operation" },
  ],
  Equipment: [{ name: "Tag No", key: "tagNo" }],
  Pipe: [{ name: "Tag No", key: "tagNo" }],
  "Specialty Item": [
    { name: "Tag No", key: "tagNo" },
    { name: "Description", key: "description" },
  ],
  Package: [
    { name: "Tag No", key: "tagNo" },
    { name: "Package Type", key: "packageType" },
  ],
  Miscellaneous: [
    { name: "Tag No", key: "tagNo" },
    { name: "Notes", key: "notes" },
  ],
};

function AnnotationDialog({ open, category, fields, initialValues, onSubmit, onCancel, style }) {
  const [values, setValues] = React.useState(initialValues || {});

  React.useEffect(() => {
    setValues(initialValues || {});
  }, [initialValues, open, fields]);

  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
      background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 8px #0002", zIndex: 10000,
      pointerEvents: "auto", // <-- ensure dialog is interactive
      ...style
    }}>
      <h4>{category} Annotation</h4>
      {fields.length === 0 && (
        <div style={{ color: "red", marginBottom: 12 }}>No fields for this category.</div>
      )}
      {fields.map((f, idx) => (
        <div key={f.key} style={{ marginBottom: 8 }}>
          <label style={{ minWidth: 90, display: "inline-block" }}>{f.name}</label>
          <input
            style={{ marginLeft: 8, padding: "2px 6px", border: "1px solid #ccc", borderRadius: 4 }}
            value={values[f.key] || ""}
            onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
            autoFocus={idx === 0}
          />
        </div>
      ))}
      <button
        onClick={() => onSubmit(values)}
        disabled={fields.some(f => !values[f.key] || values[f.key].trim() === "")}
        style={{ marginRight: 8, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px", cursor: "pointer" }}
      >
        OK
      </button>
      <button
        onClick={onCancel}
        style={{ background: "#eee", color: "#333", border: "none", borderRadius: 4, padding: "6px 16px", cursor: "pointer" }}
      >
        Cancel
      </button>
    </div>
  );
}

export default function AnnotationLayer({
  width,
  height,
  annotations,
  setAnnotations,
  category,
  annotationMode,
  annotateMode, // <-- add this prop!
  setAnnotationMode, // keep for prop signature, but not used here
  onAnnotationSubmit,
}) {
  const [drawing, setDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Drawing handlers
  const handleMouseDown = (e) => {
    if (drawing || !category) return; // Prevent drawing if already drawing or no category selected
    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();
    if (annotationMode === "box") {
      setNewShape({ type: "box", x, y, width: 0, height: 0, category, fields: {} });
    } else if (annotationMode === "free") {
      setNewShape({ type: "free", points: [x, y], category, fields: {} });
    }
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing || !newShape) return;
    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();
    if (annotationMode === "box") {
      setNewShape(prev => ({
        ...prev,
        width: x - prev.x,
        height: y - prev.y,
      }));
    } else if (annotationMode === "free") {
      setNewShape(prev => ({
        ...prev,
        points: [...prev.points, x, y],
      }));
    }
  };

  const handleMouseUp = () => {
    if (drawing && newShape) {
      setDrawing(false);

      // Only show dialog if a valid annotation is drawn
      if (
        (newShape.type === "box" && Math.abs(newShape.width) > 5 && Math.abs(newShape.height) > 5) ||
        (newShape.type === "free" && newShape.points && newShape.points.length > 6)
      ) {
        setDialogOpen(true);
      } else {
        setNewShape(null); // Discard tiny/invalid shapes
      }
    }
  };

  // Dialog submit for new or edit
  const handleDialogSubmit = (fields) => {
    let newAnn;
    if (editIndex !== null) {
      setAnnotations(prev => prev.map((a, i) => i === editIndex ? { ...a, fields } : a));
      newAnn = { ...annotations[editIndex], fields };
      setEditIndex(null);
    } else {
      newAnn = { ...newShape, category, fields };
      setAnnotations(prev => [...prev, newAnn]);
      setNewShape(null);
    }
    setDialogOpen(false);
    if (onAnnotationSubmit) onAnnotationSubmit(newAnn); // <-- send to modal
  };

  // Edit annotation (double click)
  const handleEdit = (i) => {
    setEditIndex(i);
    setDialogOpen(true);
  };

  // Move/resize for box
  const handleDrag = (i, e) => {
    const { x, y } = e.target.position();
    setAnnotations(prev =>
      prev.map((a, idx) =>
        idx === i ? { ...a, x, y } : a
      )
    );
  };

  const handleTransform = (i, e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    setAnnotations(prev =>
      prev.map((a, idx) =>
        idx === i
          ? {
              ...a,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            }
          : a
      )
    );
    node.scaleX(1);
    node.scaleY(1);
  };

  // Remove annotation
  const handleDelete = (i) => {
    setAnnotations(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}>
      <Stage
        width={width}
        height={height}
        onMouseDown={annotateMode && annotationMode && !drawing ? handleMouseDown : undefined}
        onMouseMove={annotateMode && annotationMode && drawing ? handleMouseMove : undefined}
        onMouseUp={annotateMode && annotationMode && drawing ? handleMouseUp : undefined}
        style={{ cursor: drawing ? "grabbing" : annotateMode ? "crosshair" : "grab" }}
      >
        <Layer>
          {/* Always render all annotations */}
          {annotations.map((ann, i) => {
            // Pick color based on category
            const categoryColors = {
              Instrument: "#1976d2",
              Valve: "#e53935",
              Equipment: "#43a047",
              Pipe: "#fbc02d",
              "Specialty Item": "#8e24aa",
              Package: "#00838f",
              Miscellaneous: "#6d4c41",
            };
            const boxColor = categoryColors[ann.category] || "#1976d2";
            const labelBg = boxColor + "22";

            // Label box sizing
            const labelPadding = 6;
            const minLabelWidth = 180;
            const minLabelHeight = 28;
            const numLines = 1 + Object.keys(ann.fields || {}).length;
            const lineHeight = 18;
            const labelHeight = Math.max(minLabelHeight, numLines * lineHeight);
            const labelWidth = minLabelWidth;

            // For free draw, find top-left of the points
            let labelX = ann.x;
            let labelY = ann.y;
            if (ann.type === "free" && ann.points && ann.points.length >= 2) {
              const xs = ann.points.filter((_, idx) => idx % 2 === 0);
              const ys = ann.points.filter((_, idx) => idx % 2 === 1);
              labelX = Math.min(...xs);
              labelY = Math.min(...ys);
            }

            return ann.type === "box" ? (
              <React.Fragment key={i}>
                {/* The annotation rectangle */}
                <Rect
                  x={ann.x}
                  y={ann.y}
                  width={ann.width}
                  height={ann.height}
                  stroke={boxColor}
                  strokeWidth={2}
                  draggable={annotateMode}
                  onDblClick={annotateMode ? () => handleEdit(i) : undefined}
                  onDragEnd={annotateMode ? e => handleDrag(i, e) : undefined}
                  onTransformEnd={annotateMode ? e => handleTransform(i, e) : undefined}
                  onContextMenu={annotateMode ? e => {
                    e.evt.preventDefault();
                    handleDelete(i);
                  } : undefined}
                />
                {/* Label box at top-left of the annotation box */}
                <Group
                  x={ann.x}
                  y={ann.y - labelHeight - 4}
                >
                  <Rect
                    width={labelWidth}
                    height={labelHeight}
                    fill={labelBg}
                    stroke={boxColor}
                    cornerRadius={4}
                    shadowBlur={2}
                    shadowColor={boxColor}
                  />
                  <Text
                    x={labelPadding}
                    y={labelPadding / 2}
                    width={labelWidth - 2 * labelPadding}
                    height={labelHeight - labelPadding}
                    text={
                      `${ann.category}\n` +
                      Object.entries(ann.fields || {})
                        .map(([k, v]) => `${k}: ${v}`)
                        .join("\n")
                    }
                    fontSize={13}
                    fill={boxColor}
                    fontStyle="bold"
                    ellipsis={false}
                  />
                </Group>
              </React.Fragment>
            ) : (
              <React.Fragment key={i}>
                <Line
                  points={ann.points}
                  stroke={boxColor}
                  strokeWidth={2.5} // slightly thicker for cloud effect
                  lineCap="round"
                  lineJoin="round"
                  tension={0.85} // higher tension for smoother, cloud-like curves
                  opacity={0.92}
                  onDblClick={annotateMode ? () => handleEdit(i) : undefined}
                  onContextMenu={annotateMode ? e => {
                    e.evt.preventDefault();
                    handleDelete(i);
                  } : undefined}
                />
                {/* Label box at top-left of the free draw area */}
                <Group
                  x={labelX}
                  y={labelY - labelHeight - 4}
                >
                  <Rect
                    width={labelWidth}
                    height={labelHeight}
                    fill={labelBg}
                    stroke={boxColor}
                    cornerRadius={4}
                    shadowBlur={2}
                    shadowColor={boxColor}
                  />
                  <Text
                    x={labelPadding}
                    y={labelPadding / 2}
                    width={labelWidth - 2 * labelPadding}
                    height={labelHeight - labelPadding}
                    text={
                      `${ann.category}\n` +
                      Object.entries(ann.fields || {})
                        .map(([k, v]) => `${k}: ${v}`)
                        .join("\n")
                    }
                    fontSize={13}
                    fill={boxColor}
                    fontStyle="bold"
                    ellipsis={false}
                  />
                </Group>
              </React.Fragment>
            );
          })}
          {annotationMode && newShape &&
            (newShape.type === "box" ? (
              <Rect
                x={newShape.x}
                y={newShape.y}
                width={newShape.width}
                height={newShape.height}
                stroke="green"
                dash={[4, 4]}
              />
            ) : (
              <Line
                points={newShape.points}
                stroke="green"
                strokeWidth={2}
                dash={[4, 4]}
              />
            ))}
        </Layer>
      </Stage>
      <AnnotationDialog
        open={dialogOpen}
        category={editIndex !== null ? annotations[editIndex]?.category : category}
        fields={CATEGORY_FIELDS[editIndex !== null ? annotations[editIndex]?.category : category] || []}
        initialValues={editIndex !== null ? annotations[editIndex]?.fields : {}}
        onSubmit={handleDialogSubmit}
        onCancel={() => {
          setDialogOpen(false);
          setNewShape(null);
          setEditIndex(null);
        }}
        style={{ pointerEvents: "auto" }}
      />
    </div>
  );
}
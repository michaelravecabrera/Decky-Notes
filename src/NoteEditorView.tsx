import { ButtonItem, PanelSection, PanelSectionRow, TextField } from "@decky/ui";
import { callable } from "@decky/api";
import { useState, useEffect, useRef, useCallback } from "react";
import { Note } from "./types";

const saveNote = callable<[note_id: string, title: string, content: string], Note | null>("save_note");
const deleteNote = callable<[note_id: string], boolean>("delete_note");

interface NoteEditorViewProps {
  note: Note;
  onBack: () => void;
}

export function NoteEditorView({ note, onBack }: NoteEditorViewProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const titleRef = useRef(title);
  const contentRef = useRef(content);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPendingSave = useRef(false);

  titleRef.current = title;
  contentRef.current = content;

  const doSave = useCallback(async () => {
    hasPendingSave.current = false;
    await saveNote(note.id, titleRef.current, contentRef.current);
  }, [note.id]);

  const scheduleSave = useCallback(() => {
    hasPendingSave.current = true;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(doSave, 2000);
  }, [doSave]);

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (hasPendingSave.current) {
        saveNote(note.id, titleRef.current, contentRef.current);
      }
    };
  }, [note.id]);

  const handleTitleChange = (e: { target: { value: string } }) => {
    setTitle(e.target.value);
    scheduleSave();
  };

  const handleContentChange = (e: { target: { value: string } }) => {
    setContent(e.target.value);
    scheduleSave();
  };

  const handleBack = async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    await saveNote(note.id, titleRef.current, contentRef.current);
    onBack();
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    await deleteNote(note.id);
    onBack();
  };

  return (
    <PanelSection>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={handleBack}>
          ← Back
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <TextField
          label="Title"
          value={title}
          onChange={handleTitleChange}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <TextField
          label="Content"
          value={content}
          onChange={handleContentChange}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={handleDelete}>
          {confirmDelete ? "⚠ Confirm Delete?" : "Delete Note"}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}

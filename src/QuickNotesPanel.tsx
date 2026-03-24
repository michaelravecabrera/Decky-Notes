import { callable } from "@decky/api";
import { useState, useEffect } from "react";
import { Note } from "./types";
import { NoteListView } from "./NoteListView";
import { NoteEditorView } from "./NoteEditorView";

const getNotes = callable<[], Note[]>("get_notes");
const createNote = callable<[], Note>("create_note");

export function QuickNotesPanel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    const result = await getNotes();
    setNotes(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async () => {
    const note = await createNote();
    setNotes((prev) => [note, ...prev]);
    setActiveNoteId(note.id);
  };

  const handleBack = () => {
    setActiveNoteId(null);
    fetchNotes();
  };

  if (loading) {
    return <div style={{ padding: "16px", textAlign: "center", opacity: 0.6 }}>Loading...</div>;
  }

  const activeNote = notes.find((n) => n.id === activeNoteId);

  if (activeNote) {
    return <NoteEditorView note={activeNote} onBack={handleBack} />;
  }

  return (
    <NoteListView
      notes={notes}
      onSelect={(id) => setActiveNoteId(id)}
      onCreate={handleCreate}
    />
  );
}

import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import { Note } from "./types";

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface NoteListViewProps {
  notes: Note[];
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export function NoteListView({ notes, onSelect, onCreate }: NoteListViewProps) {
  return (
    <PanelSection title="Decky Notes">
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={onCreate}>
          + New Note
        </ButtonItem>
      </PanelSectionRow>
      {notes.length === 0 ? (
        <PanelSectionRow>
          <div style={{ textAlign: "center", opacity: 0.6, padding: "16px 0" }}>
            No notes yet. Tap above to create one!
          </div>
        </PanelSectionRow>
      ) : (
        notes.map((note) => (
          <PanelSectionRow key={note.id}>
            <ButtonItem layout="below" onClick={() => onSelect(note.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {note.title || "Untitled"}
                </span>
                <span style={{ opacity: 0.5, fontSize: "0.85em", marginLeft: "8px", flexShrink: 0 }}>
                  {timeAgo(note.updated_at)}
                </span>
              </div>
            </ButtonItem>
          </PanelSectionRow>
        ))
      )}
    </PanelSection>
  );
}

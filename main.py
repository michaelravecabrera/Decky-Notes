import decky
import json
import uuid
import os
import time


class Plugin:
    notes: list = []
    notes_path: str = ""

    async def _main(self):
        self.notes_path = os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, "notes.json")
        self._load_notes()
        decky.logger.info(f"Decky Notes loaded with {len(self.notes)} notes")

    async def _unload(self):
        self._save_notes()
        decky.logger.info("Decky Notes unloaded")

    def _load_notes(self):
        try:
            if os.path.exists(self.notes_path):
                with open(self.notes_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.notes = data.get("notes", [])
            else:
                self.notes = []
                self._save_notes()
        except Exception as e:
            decky.logger.error(f"Failed to load notes: {e}")
            self.notes = []

    def _save_notes(self):
        try:
            os.makedirs(os.path.dirname(self.notes_path), exist_ok=True)
            with open(self.notes_path, "w", encoding="utf-8") as f:
                json.dump({"notes": self.notes}, f, ensure_ascii=False, indent=2)
        except Exception as e:
            decky.logger.error(f"Failed to save notes: {e}")

    async def get_notes(self):
        sorted_notes = sorted(self.notes, key=lambda n: n.get("updated_at", 0), reverse=True)
        return sorted_notes

    async def create_note(self):
        now = int(time.time())
        note = {
            "id": str(uuid.uuid4()),
            "title": "",
            "content": "",
            "created_at": now,
            "updated_at": now,
        }
        self.notes.append(note)
        self._save_notes()
        return note

    async def save_note(self, note_id: str, title: str, content: str):
        for note in self.notes:
            if note["id"] == note_id:
                note["title"] = title
                note["content"] = content
                note["updated_at"] = int(time.time())
                self._save_notes()
                return note
        return None

    async def delete_note(self, note_id: str):
        self.notes = [n for n in self.notes if n["id"] != note_id]
        self._save_notes()
        return True

import { staticClasses } from "@decky/ui";
import { definePlugin } from "@decky/api";
import { FaBook } from "react-icons/fa";
import { QuickNotesPanel } from "./QuickNotesPanel";

export default definePlugin(() => {
  console.log("QuickNotes plugin loaded");

  return {
    name: "QuickNotes",
    titleView: <div className={staticClasses.Title}>QuickNotes</div>,
    content: <QuickNotesPanel />,
    icon: <FaBook />,
    onDismount() {
      console.log("QuickNotes unloaded");
    },
  };
});

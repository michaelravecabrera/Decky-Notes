import { staticClasses } from "@decky/ui";
import { definePlugin } from "@decky/api";
import { FaBook } from "react-icons/fa";
import { QuickNotesPanel } from "./QuickNotesPanel";

export default definePlugin(() => {
  console.log("Decky Notes plugin loaded");

  return {
    name: "Decky Notes",
    titleView: <div className={staticClasses.Title}>Decky Notes</div>,
    content: <QuickNotesPanel />,
    icon: <FaBook />,
    onDismount() {
      console.log("Decky Notes unloaded");
    },
  };
});

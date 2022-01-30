import {useContext} from "react";
import {NotesContext, NotesContextProps} from "../NotesContext";

const useNotes = (): NotesContextProps => {
  const context = useContext(NotesContext);

  if (!context) throw new Error("NotesContext must be used inside NotesProvider");

  return context;
};
export default useNotes;

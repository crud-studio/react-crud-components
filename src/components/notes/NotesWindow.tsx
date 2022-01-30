import React from "react";
import {Divider, Stack} from "@mui/material";
import NoteInput from "./NoteInput";
import NoteList from "./NoteList";
import {NotesProvider} from "../../entity/contexts/notes/NotesContext";

type NotesWindowProps = {
  targetType: string;
  targetId: number;
};

export default function NotesWindow({targetType, targetId}: NotesWindowProps) {
  return (
    <NotesProvider targetType={targetType} targetId={targetId}>
      <Stack sx={{flexGrow: 1}}>
        <NoteList />
        <Divider />
        <NoteInput />
      </Stack>
    </NotesProvider>
  );
}

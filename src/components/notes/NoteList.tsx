import React, {useMemo, useState} from "react";
import NoteItem from "./NoteItem";
import {useUpdateEffect} from "react-use";
import useNotes from "../../entity/contexts/notes/hooks/useNotes";
import InfiniteList from "../common/InfiniteList";
import {noteEntity} from "../../entities/note.entity";
import {FilterField} from "@crud-studio/react-crud-core";
import {Box} from "@mui/material";

type NoteListProps = {};

export default function NoteList({}: NoteListProps) {
  const {targetType, targetId, createdNote} = useNotes();

  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  const filterFields = useMemo<FilterField[]>(
    () => [
      {fieldName: "targetType", values: [targetType], operation: "Equal"},
      {fieldName: "targetId", values: [targetId], operation: "Equal"},
    ],
    [targetType, targetId]
  );

  useUpdateEffect(() => {
    if (createdNote) {
      setRefreshFlag((currentRefreshFlag) => currentRefreshFlag + 1);
    }
  }, [createdNote]);

  return (
    <Box sx={{height: 0, flexGrow: 1}}>
      <InfiniteList
        entity={noteEntity}
        filterFields={filterFields}
        ListItem={NoteItem}
        reversed={true}
        refreshFlag={refreshFlag}
      />
    </Box>
  );
}

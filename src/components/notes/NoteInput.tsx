import React, {useCallback, useEffect, useMemo, useState} from "react";
import {styled} from "@mui/material/styles";
import {Input, Divider, IconButton} from "@mui/material";
import useNotes from "../../entity/contexts/notes/hooks/useNotes";
import {useIntl} from "react-intl";
import {useCrudCreate} from "@crud-studio/react-crud-core";
import {NoteRO} from "../../entity/contexts/notes/NotesContext";
import {noteEntity} from "../../entities/note.entity";
import {PartialDeep} from "type-fest";
import {toString} from "lodash";
import {Send as SendIcon} from "@mui/icons-material";

const RootStyle = styled("div")(({theme}) => ({
  minHeight: 56,
  display: "flex",
  position: "relative",
  alignItems: "center",
  paddingLeft: theme.spacing(2),
}));

type NoteInputProps = {
  disabled?: boolean;
};

export default function NoteInput({disabled}: NoteInputProps) {
  const {targetType, targetId, setCreatedNote} = useNotes();
  const intl = useIntl();

  const [content, setContent] = useState<string>("");
  const [note, setNote] = useState<PartialDeep<NoteRO> | undefined>(undefined);

  const createState = useCrudCreate<NoteRO, NoteRO>(noteEntity, note);

  useEffect(() => {
    if (note) {
      createState.executeRequest();
    }
  }, [note]);

  useEffect(() => {
    if (createState.result) {
      setCreatedNote(createState.result);
    }
  }, [createState.result]);

  const handleSend = useCallback((): void => {
    if (!content) {
      return;
    }

    setNote({
      id: 0,
      creationTime: new Date().getTime(),
      content: content,
      targetType: targetType,
      targetId: toString(targetId),
    });
    setContent("");
  }, [content, setContent, setNote]);

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSend();
      }
    },
    [handleSend]
  );

  const isSendDisabled = useMemo<boolean>(
    () => !!disabled || !content || createState.loading,
    [disabled, content, createState.loading]
  );

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={content}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(e) => setContent(e.target.value)}
        placeholder={intl.formatMessage({id: "pages.type-a-note"})}
        // startAdornment={
        //   <InputAdornment position="start">
        //     <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
        //   </InputAdornment>
        // }
        // endAdornment={
        //   <Box sx={{flexShrink: 0, mr: 1.5, "& > *": {mx: 0.5}}}>
        //     <IconButton disabled={disabled} size="small" onClick={handleAttach}>
        //       <Icon icon={roundAddPhotoAlternate} width={24} height={24} />
        //     </IconButton>
        //     <IconButton disabled={disabled} size="small" onClick={handleAttach}>
        //       <Icon icon={attach2Fill} width={24} height={24} />
        //     </IconButton>
        //     <IconButton disabled={disabled} size="small">
        //       <Icon icon={micFill} width={24} height={24} />
        //     </IconButton>
        //   </Box>
        // }
        sx={{height: "100%"}}
      />

      <Divider orientation="vertical" flexItem />

      <IconButton color="primary" disabled={isSendDisabled} onClick={handleSend} sx={{mx: 1}}>
        <SendIcon />
      </IconButton>
    </RootStyle>
  );
}

import {formatDistanceToNowStrict} from "date-fns";
import {styled} from "@mui/material/styles";
import {Avatar, Box, Typography} from "@mui/material";
import React, {useMemo} from "react";
import {NoteRO} from "../../entity/contexts/notes/NotesContext";
import {InfiniteListItemProps} from "../common/InfiniteList";
import {toString} from "lodash";
import useGrants from "../../contexts/grants/hooks/useGrants";

const RootStyle = styled("div")(({theme}) => ({
  display: "flex",
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const ContentStyle = styled("div")(({theme}) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  // @ts-ignore
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({theme}) => ({
  display: "flex",
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const MessageImgStyle = styled("img")(({theme}) => ({
  width: "100%",
  cursor: "pointer",
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up("md")]: {
    height: 200,
    minWidth: 296,
  },
}));

export default function NoteItem({item}: InfiniteListItemProps<NoteRO>) {
  const {loggedInType, loggedInId} = useGrants();

  const isMe = useMemo<boolean>(
    () => item.creatorType === loggedInType && item.creatorId === toString(loggedInId),
    [item, loggedInType, loggedInId]
  );
  const displayName = useMemo<string>(() => item.creatorInfo?.displayName || "", [item]);
  const creationTime = useMemo<number>(() => item.creationTime || new Date().getTime(), [item]);

  return (
    <RootStyle>
      <Box
        sx={{
          display: "flex",
          ...(isMe && {
            ml: "auto",
          }),
        }}
      >
        {!isMe && (
          <Avatar
            alt={displayName}
            // @ts-ignore
            sx={{width: 32, height: 32, mr: 2, bgcolor: (theme) => theme.palette.background.neutral}}
          />
        )}

        <div>
          <InfoStyle variant="caption" sx={{...(isMe && {justifyContent: "flex-end"})}}>
            {!isMe && `${displayName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(creationTime), {
              addSuffix: true,
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && {color: "grey.800", bgcolor: "primary.lighter"}),
              // ...(isImage && {p: 0}),
            }}
          >
            {/*{isImage ? (*/}
            {/*  <MessageImgStyle alt="attachment" src={message.body} onClick={() => onOpenLightbox(message.body)} />*/}
            {/*) : (*/}
            <Typography variant="body2">{item.content}</Typography>
            {/*)}*/}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}

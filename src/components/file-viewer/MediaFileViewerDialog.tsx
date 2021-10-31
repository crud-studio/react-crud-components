import React, {FunctionComponent} from "react";
import {FormattedMessage} from "react-intl";
import {useUpdateEffect} from "react-use";
import {MinimalMediaFileRO} from "@crud-studio/react-crud-core";
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import MediaFileViewer from "./MediaFileViewer";
import useModals from "../../contexts/modals/hooks/useModals";
import DialogTitleEnhanced from "../dialogs/DialogTitleEnhanced";

interface IProps {
  modalId: string;
  mediaFile?: MinimalMediaFileRO;
}

const MediaFileViewerDialog: FunctionComponent<IProps> = ({modalId, mediaFile}) => {
  const {isModalOpen, hideModal, hideModalWrapper} = useModals();

  useUpdateEffect(() => {
    if (isModalOpen(modalId) && !mediaFile?.uuid) {
      hideModal(modalId);
    }
  }, [mediaFile]);

  return (
    <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)} fullWidth maxWidth="md">
      <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
        <FormattedMessage id="pages.preview" />
        {mediaFile?.name && `: ${mediaFile.name}`}
      </DialogTitleEnhanced>
      <DialogContent>{mediaFile && <MediaFileViewer mediaFile={mediaFile} />}</DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.close" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default MediaFileViewerDialog;

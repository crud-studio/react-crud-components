import React, {FunctionComponent} from "react";
import {FormattedMessage} from "react-intl";
import {useUpdateEffect} from "react-use";
import {MinimalMediaFileRO} from "@crud-studio/react-crud-core";
import {Button, Dialog, DialogActions, DialogContent, Portal} from "@mui/material";
import MediaFileViewer from "./MediaFileViewer";
import DialogTitleEnhanced from "../dialogs/DialogTitleEnhanced";
import NiceModal, {muiDialog, useModal} from "@ebay/nice-modal-react";
import PropagationStopper from "../common/PropagationStopper";

export type MediaFileViewerDialogProps = {
  mediaFile?: MinimalMediaFileRO;
};

const MediaFileViewerDialog: FunctionComponent<MediaFileViewerDialogProps> = NiceModal.create(({mediaFile}) => {
  const modal = useModal();

  useUpdateEffect(() => {
    if (modal.visible && !mediaFile?.uuid) {
      modal.hide();
    }
  }, [mediaFile]);

  return (
    <Portal>
      <PropagationStopper>
        <Dialog {...muiDialog(modal)} fullWidth maxWidth="md">
          <DialogTitleEnhanced onClose={modal.hide}>
            <FormattedMessage id="pages.preview" />
            {mediaFile?.name && `: ${mediaFile.name}`}
          </DialogTitleEnhanced>
          <DialogContent>{mediaFile && <MediaFileViewer mediaFile={mediaFile} />}</DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={modal.hide}>
              <FormattedMessage id="pages.close" />
            </Button>
          </DialogActions>
        </Dialog>
      </PropagationStopper>
    </Portal>
  );
});
export default MediaFileViewerDialog;

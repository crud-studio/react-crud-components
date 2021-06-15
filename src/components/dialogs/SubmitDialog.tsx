import {FormattedMessage} from "react-intl";
import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import _ from "lodash";
import {Button, Dialog, DialogActions, DialogContent, DialogProps} from "@material-ui/core";
import DialogTitleEnhanced from "./DialogTitleEnhanced";
import {ModalsContext} from "../../managers/ModalManager";
import StatusButton from "../buttons/StatusButton";
import ConfirmationDialog from "./ConfirmationDialog";

interface IProps {
  modalId: string;
  modalTitleKey: string;
  setModalItem?: (item: any) => void;
  initialValue?: any;
  submitTextKey?: string;
  SubmitForm: React.ComponentType<any>; // TODO: Improve from "any" to specific props
  SubmitFormProps?: object;
  DialogProps?: DialogProps;
}

const SubmitDialog: FunctionComponent<IProps> = ({
  modalId,
  modalTitleKey,
  setModalItem,
  initialValue,
  submitTextKey,
  SubmitForm,
  SubmitFormProps,
  DialogProps,
}) => {
  const {isModalOpen, showModal, hideModal, hideModalWrapper} = useContext(ModalsContext);
  const [confirmCloseModalId] = useState<string>(_.uniqueId("confirmClose_"));

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const hideModalWithChangesCheck = (): void => {
    if (hasChanges) {
      showModal(confirmCloseModalId);
    } else {
      hideModal(modalId);
    }
  };

  useEffect(() => {
    if (item) {
      hideModal(modalId);

      if (setModalItem) {
        setModalItem(item);
      }
    }
  }, [item]);

  const [submit, setSubmit] = useState<(() => void) | null>(null);

  const onSubmit = (): void => {
    if (submit) {
      submit();
    }
  };

  return (
    <>
      <ConfirmationDialog
        modalId={confirmCloseModalId}
        modalTitleKey="pages.close"
        modalTextKey="modal.confirm-close-save-changes"
        onConfirm={hideModalWrapper(modalId)}
      />

      <Dialog {...DialogProps} open={isModalOpen(modalId)} onClose={hideModalWithChangesCheck}>
        <DialogTitleEnhanced onClose={hideModalWithChangesCheck}>
          <FormattedMessage id={modalTitleKey} />
        </DialogTitleEnhanced>

        <DialogContent>
          <SubmitForm
            {...SubmitFormProps}
            setSubmit={setSubmit}
            setCreatedItem={setItem}
            setLoading={setLoading}
            setHasChanges={setHasChanges}
            initialValue={initialValue}
          />
        </DialogContent>

        <DialogActions>
          <Button color="primary" variant="outlined" onClick={hideModalWithChangesCheck}>
            <FormattedMessage id="pages.cancel" />
          </Button>{" "}
          <StatusButton color="primary" onClick={onSubmit} loading={loading} result={item}>
            <FormattedMessage id={submitTextKey || "pages.submit"} />
          </StatusButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubmitDialog;

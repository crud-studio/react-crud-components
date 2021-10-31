import {FormattedMessage, useIntl} from "react-intl";
import React, {FunctionComponent} from "react";
import {Controller, useForm} from "react-hook-form";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField} from "@mui/material";
import DialogTitleEnhanced from "./DialogTitleEnhanced";
import useModals from "../../contexts/modals/hooks/useModals";

interface IProps {
  modalId: string;
  modalTitleKey: string;
  modalTitleValues?: any;
  modalTextKey: string;
  modalTextValues?: any;
  confirmTextKey: string;
  onConfirm: () => void;
}

type FormValues = {
  confirm: string;
};

const ConfirmationTypingDialog: FunctionComponent<IProps> = ({
  modalId,
  modalTitleKey,
  modalTitleValues,
  modalTextKey,
  modalTextValues,
  confirmTextKey,
  onConfirm,
}) => {
  const {isModalOpen, hideModal, hideModalWrapper} = useModals();
  const intl = useIntl();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>();

  const confirm = (): void => {
    hideModal(modalId);
    onConfirm();
  };

  const onSubmit = handleSubmit((data): void => {
    confirm();
  });

  const validateContains = (value: string, textToContain: string): string | undefined => {
    if (!textToContain) {
      return undefined;
    }
    if (!value) {
      return intl.formatMessage({id: "pages.required-field"});
    }
    if (value.toLowerCase().indexOf(textToContain.toLowerCase()) < 0) {
      return intl.formatMessage({id: "pages.type-to-confirm"}).replace("{confirm}", textToContain);
    }
    return undefined;
  };

  return (
    <>
      <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)}>
        <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
          <FormattedMessage id={modalTitleKey} values={modalTitleValues || {}} />
        </DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id={modalTextKey} values={modalTextValues || {}} />
          </DialogContentText>

          <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>
            <Controller
              name="confirm"
              rules={{
                required: intl.formatMessage({id: "pages.required-field"}),
                validate: (data) => validateContains(data, intl.formatMessage({id: confirmTextKey})),
              }}
              control={control}
              defaultValue=""
              render={({field}) => {
                return (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label={
                      <FormattedMessage
                        id="pages.type-to-confirm"
                        values={{confirm: intl.formatMessage({id: confirmTextKey})}}
                      />
                    }
                    value={field?.value}
                    type="text"
                    autoComplete="off"
                    autoFocus
                    onChange={field?.onChange}
                    error={!!errors.confirm}
                    helperText={errors.confirm?.message}
                    ref={field?.ref}
                    sx={{mb: 0}}
                  />
                );
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={hideModalWrapper(modalId)}>
            <FormattedMessage id="pages.cancel" />
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            <FormattedMessage id="pages.continue" />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationTypingDialog;

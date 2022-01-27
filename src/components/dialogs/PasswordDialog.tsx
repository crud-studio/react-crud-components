import React, {FunctionComponent, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useUpdateEffect} from "react-use";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField} from "@mui/material";
import DialogTitleEnhanced from "./DialogTitleEnhanced";
import {FormattedMessage, useIntl} from "react-intl";
import NiceModal, {useModal} from "@ebay/nice-modal-react";

export type PasswordDialogProps = {
  modalTitleKey: string;
  modalTitleValues?: any;
  modalTextKey: string;
  modalTextValues?: any;
  onPassword?: (password: string) => void;
  onPasswordDismissed?: () => void;
};

type FormValues = {
  password: string;
};

const PasswordDialog: FunctionComponent<PasswordDialogProps> = NiceModal.create(
  ({modalTitleKey, modalTitleValues, modalTextKey, modalTextValues, onPassword, onPasswordDismissed}) => {
    const modal = useModal();
    const intl = useIntl();

    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const [password, setPassword] = useState<string | null>(null);

    const {control, handleSubmit} = useForm<FormValues>();

    const onSubmit = handleSubmit((data): void => {
      setPassword(data.password);
      onPassword?.(data.password);

      modal.resolve(data.password);
      modal.hide();
    });

    useUpdateEffect(() => {
      if (modal.visible) {
        setModalOpened(true);
      } else if (modalOpened) {
        setModalOpened(false);
        if (!password && onPasswordDismissed) {
          onPasswordDismissed();
        }
      }
    }, [modal.visible]);

    return (
      <Dialog
        open={modal.visible}
        onClose={() => modal.hide()}
        TransitionProps={{
          onExited: () => modal.remove(),
        }}
      >
        <DialogTitleEnhanced onClose={modal.hide}>
          <FormattedMessage id={modalTitleKey} values={modalTitleValues || {}} />
        </DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id={modalTextKey} values={modalTextValues || {}} />
          </DialogContentText>

          <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>
            <Controller
              name="password"
              rules={{
                required: intl.formatMessage({id: "pages.required-field"}),
              }}
              control={control}
              defaultValue=""
              render={({field: {ref, ...field}, fieldState: {invalid, error}}) => {
                return (
                  <TextField
                    {...field}
                    inputRef={ref}
                    margin="normal"
                    required
                    fullWidth
                    label={<FormattedMessage id="pages.password" />}
                    type="password"
                    autoComplete="off"
                    autoFocus
                    error={invalid}
                    helperText={error}
                    sx={{mb: 0}}
                  />
                );
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={modal.hide}>
            <FormattedMessage id="pages.cancel" />
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            <FormattedMessage id="pages.continue" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default PasswordDialog;

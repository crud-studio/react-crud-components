import React, {FunctionComponent, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useUpdateEffect} from "react-use";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField} from "@material-ui/core";
import DialogTitleEnhanced from "./DialogTitleEnhanced";
import {FormattedMessage, useIntl} from "react-intl";
import useModals from "../../managers/modals/hooks/useModals";

interface IProps {
  modalId: string;
  modalTitleKey: string;
  modalTitleValues?: any;
  modalTextKey: string;
  modalTextValues?: any;
  onPassword?: (password: string) => void;
  onPasswordDismissed?: () => void;
}

type FormValues = {
  password: string;
};

const PasswordDialog: FunctionComponent<IProps> = ({
  modalId,
  modalTitleKey,
  modalTitleValues,
  modalTextKey,
  modalTextValues,
  onPassword,
  onPasswordDismissed,
}) => {
  const {modalOpenIds, isModalOpen, hideModal, hideModalWrapper} = useModals();
  const intl = useIntl();

  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>();

  const onSubmit = handleSubmit((data): void => {
    setPassword(data.password);

    if (onPassword) {
      onPassword(data.password);
    }

    hideModal(modalId);
  });

  useUpdateEffect(() => {
    if (isModalOpen(modalId)) {
      setModalOpened(true);
    } else if (modalOpened) {
      setModalOpened(false);
      if (!password && onPasswordDismissed) {
        onPasswordDismissed();
      }
    }
  }, [modalOpenIds]);

  return (
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
            name="password"
            rules={{
              required: intl.formatMessage({id: "pages.required-field"}),
            }}
            control={control}
            defaultValue=""
            render={({field}) => {
              return (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label={<FormattedMessage id="pages.password" />}
                  value={field?.value}
                  type="password"
                  autoComplete="off"
                  autoFocus
                  onChange={field?.onChange}
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
  );
};

export default PasswordDialog;

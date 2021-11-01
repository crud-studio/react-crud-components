import React, {FunctionComponent, useCallback, useMemo, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {CircularProgress, IconButton, InputAdornment, TextField} from "@mui/material";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import {FormattedMessage, useIntl} from "react-intl";
import {Clear, RemoveRedEye, Upload} from "@mui/icons-material";
import {DropEvent, FileRejection, useDropzone} from "react-dropzone";
import {MediaFileAclMode, MinimalMediaFileRO, useMediaFileUpload} from "@crud-studio/react-crud-core";
import {useUpdateEffect} from "react-use";
import MediaFileViewerDialog from "../../../../components/file-viewer/MediaFileViewerDialog";
import _ from "lodash";
import {EntityFieldParametersFile} from "../../../../models/entity";
import {getFilesRejectedMessageKey} from "../../../../helpers/FileUtils";
import {useSnackbar} from "notistack";
import NiceModal from "@ebay/nice-modal-react";

const EntityFieldInputFile: FunctionComponent<IPropsEntityColumnInputType> = ({
  entityField,
  name,
  disabled,
  defaultValue,
  onValueChanged,
}) => {
  const intl = useIntl();
  const methods = useFormContext();
  const {enqueueSnackbar} = useSnackbar();

  const [value, setValue] = useState<MinimalMediaFileRO | undefined>(defaultValue || undefined);
  const [file, setFile] = useState<File | undefined>(undefined);

  const parameters = useMemo<EntityFieldParametersFile | undefined>(
    () => entityField.parameters as EntityFieldParametersFile | undefined,
    [entityField]
  );
  const acl = useMemo<MediaFileAclMode>(() => parameters?.acl || "PRIVATE", [parameters]);
  const extensions = useMemo<string | undefined>(() => parameters?.extensions?.join(", "), [parameters]);
  const minSize = useMemo<number | undefined>(() => parameters?.minSize, [parameters]);
  const maxSize = useMemo<number | undefined>(() => parameters?.maxSize, [parameters]);

  useUpdateEffect(() => {
    const formValue = value || {id: null, uuid: null};
    methods.setValue(name, formValue);
    onValueChanged(formValue);
  }, [value]);

  const uploadState = useMediaFileUpload(file, {acl: acl});

  useUpdateEffect(() => {
    if (uploadState.result) {
      setValue(uploadState.result);
    }
  }, [uploadState.result]);

  useUpdateEffect(() => {
    if (file) {
      if (uploadState.loading) {
        uploadState.cancelRequest();
      }
      uploadState.executeRequest();
    }
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
    if (!_.isEmpty(acceptedFiles)) {
      setFile(acceptedFiles[0]);
    }
    if (!_.isEmpty(fileRejections)) {
      fileRejections.forEach((fileRejection) =>
        enqueueSnackbar(<FormattedMessage id={getFilesRejectedMessageKey(fileRejection)} />, {variant: "error"})
      );
    }
  }, []);

  const {getRootProps, getInputProps, open} = useDropzone({
    onDrop,
    multiple: false,
    accept: extensions,
    minSize: minSize,
    maxSize: maxSize,
  });

  const onUpload = useCallback(() => {
    open();
  }, [open]);

  const onClear = useCallback(() => {
    setValue(undefined);
  }, [setValue]);

  const onPreview = useCallback(() => {
    if (value) {
      NiceModal.show(MediaFileViewerDialog, {
        mediaFile: value,
      });
    }
  }, [value]);

  const inputValue = useMemo<string>(() => value?.name || "", [value]);

  return (
    <Controller
      name={name}
      rules={{required: entityField.required ? intl.formatMessage({id: "pages.required-field"}) : false}}
      control={methods.control}
      defaultValue={inputValue}
      render={({field}) => {
        return (
          <TextField
            type="text"
            value={inputValue}
            disabled={disabled}
            autoComplete="off"
            ref={field?.ref}
            fullWidth
            label={<FormattedMessage id={entityField.titleKey} defaultMessage={entityField.titleKey} />}
            helperText={extensions}
            required={entityField.required}
            inputProps={{...getRootProps()}}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <>
                  <input {...getInputProps()} />
                  {uploadState.loading && (
                    <InputAdornment position="end">
                      <CircularProgress variant="determinate" value={uploadState.progress} size={16} />
                    </InputAdornment>
                  )}
                  {value && (
                    <InputAdornment position="end">
                      <IconButton edge="end" disabled={disabled} onClick={onClear}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )}
                  {value && (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={onPreview}>
                        <RemoveRedEye />
                      </IconButton>
                    </InputAdornment>
                  )}
                  <InputAdornment position="end">
                    <IconButton edge="end" disabled={disabled} onClick={onUpload}>
                      <Upload />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
          />
        );
      }}
    />
  );
};
export default EntityFieldInputFile;

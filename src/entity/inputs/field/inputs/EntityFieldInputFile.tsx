import React, {FunctionComponent, useCallback, useMemo, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {CircularProgress, IconButton, InputAdornment, TextField} from "@material-ui/core";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import {FormattedMessage, useIntl} from "react-intl";
import {Clear, RemoveRedEye, Upload} from "@material-ui/icons";
import {DropEvent, FileRejection, useDropzone} from "react-dropzone";
import {MinimalMediaFileRO, useMediaFileUpload} from "@crud-studio/react-crud-core";
import {useUpdateEffect} from "react-use";
import MediaFileViewerDialog from "../../../../components/file-viewer/MediaFileViewerDialog";
import useModals from "../../../../managers/modals/hooks/useModals";
import _ from "lodash";

const EntityFieldInputFile: FunctionComponent<IPropsEntityColumnInputType> = ({
  entityField,
  name,
  disabled,
  defaultValue,
  onValueChanged,
}) => {
  const {showModal, getModalKey} = useModals();
  const [viewerModalId] = useState<string>(_.uniqueId("viewer"));

  const intl = useIntl();
  const methods = useFormContext();

  const [value, setValue] = useState<MinimalMediaFileRO | undefined>(defaultValue || undefined);
  const [file, setFile] = useState<File | undefined>(undefined);

  useUpdateEffect(() => {
    const formValue = value || {id: null, uuid: null};
    methods.setValue(name, formValue);
    onValueChanged(formValue);
  }, [value]);

  // TODO: ACL should received in config
  const uploadState = useMediaFileUpload(file, {acl: "PUBLIC"});

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
    // TODO: Handle file rejections and show errors
  }, []);

  const {getRootProps, getInputProps, open} = useDropzone({onDrop, multiple: false});

  const onUpload = useCallback(() => {
    open();
  }, [open]);

  const onClear = useCallback(() => {
    setValue(undefined);
  }, [setValue]);

  const onPreview = useCallback(() => {
    if (value) {
      showModal(viewerModalId);
    }
  }, [value]);

  const inputValue = useMemo<string>(() => value?.name || "", [value]);

  return (
    <>
      <MediaFileViewerDialog modalId={viewerModalId} mediaFile={value} key={getModalKey(viewerModalId)} />
      {/* TODO: Show extensions in help text */}
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
              onChange={(e) => {
                //   const inputValue = e.target.value;
                //   field?.onChange(inputValue);
                //   onValueChanged(inputValue);
              }}
              disabled={disabled}
              autoComplete="off"
              ref={field?.ref}
              fullWidth
              label={<FormattedMessage id={entityField.titleKey} defaultMessage={entityField.titleKey} />}
              required={entityField.required}
              // placeholder={intl.formatMessage({id: "pages.drop-files-here-or-click"})}
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
    </>
  );
};
export default EntityFieldInputFile;

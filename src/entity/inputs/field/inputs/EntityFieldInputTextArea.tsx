import React, {FunctionComponent} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {TextField} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {IPropsEntityColumnInputType} from "../../../../models/props";

const EntityFieldInputTextArea: FunctionComponent<IPropsEntityColumnInputType> = ({
  entityField,
  name,
  disabled,
  defaultValue,
  onValueChanged,
}) => {
  const intl = useIntl();
  const methods = useFormContext();

  return (
    <Controller
      name={name}
      rules={{required: entityField.required ? intl.formatMessage({id: "pages.required-field"}) : false}}
      control={methods.control}
      defaultValue={defaultValue || null}
      render={({field}) => {
        return (
          <TextField
            type="text"
            defaultValue={defaultValue || ""}
            onChange={(e) => {
              const inputValue = e.target.value;
              field?.onChange(inputValue);
              onValueChanged(inputValue);
            }}
            disabled={disabled}
            autoComplete="off"
            inputProps={{
              maxLength: 255,
            }}
            ref={field?.ref}
            fullWidth
            label={<FormattedMessage id={entityField.titleKey} defaultMessage={entityField.titleKey} />}
            required={entityField.required}
            multiline={true}
            minRows={3}
          />
        );
      }}
    />
  );
};
export default EntityFieldInputTextArea;

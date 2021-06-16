import React, {FunctionComponent} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {OutlinedInput} from "@material-ui/core";
import {useIntl} from "react-intl";
import {IPropsEntityColumnInputType} from "../../../../models/props";

const EntityColumnInputNumber: FunctionComponent<IPropsEntityColumnInputType> = ({
  column,
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
      rules={{required: column.required ? intl.formatMessage({id: "pages.required-field"}) : false}}
      control={methods.control}
      defaultValue={defaultValue || null}
      render={({field}: any) => {
        return (
          <OutlinedInput
            type="number"
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
            ref={field.ref}
            fullWidth
          />
        );
      }}
    />
  );
};
export default EntityColumnInputNumber;

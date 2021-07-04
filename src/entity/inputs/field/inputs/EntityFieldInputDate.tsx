import React, {FunctionComponent} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import DatePickerWrapper from "../../../../components/inputs/DatePickerWrapper";
import {useIntl} from "react-intl";

const EntityFieldInputDate: FunctionComponent<IPropsEntityColumnInputType> = ({
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
      control={methods?.control}
      rules={{required: entityField.required ? intl.formatMessage({id: "pages.required-field"}) : false}}
      defaultValue={defaultValue || null}
      render={({field}) => {
        return (
          <DatePickerWrapper
            onChange={(value) => {
              field?.onChange(value);
              onValueChanged(value);
            }}
            value={field?.value}
            disabled={disabled}
            innerRef={field?.ref}
          />
        );
      }}
    />
  );
};
export default EntityFieldInputDate;

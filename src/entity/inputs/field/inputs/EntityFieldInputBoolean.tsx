import React, {FunctionComponent} from "react";
import {Controller, useFormContext} from "react-hook-form";
import _ from "lodash";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import BooleanRadioButton from "../../../../components/inputs/BooleanRadioButton";
import {useIntl} from "react-intl";

const EntityFieldInputBoolean: FunctionComponent<IPropsEntityColumnInputType> = ({
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
      defaultValue={_.isNil(defaultValue) ? null : _.toString(defaultValue)}
      render={({field}) => {
        return (
          <BooleanRadioButton
            group={name}
            onChange={(e) => {
              field?.onChange(e);
              onValueChanged(e);
            }}
            value={field.value}
            disabled={disabled}
            innerRef={field?.ref}
          />
        );
      }}
    />
  );
};
export default EntityFieldInputBoolean;

import React, {FunctionComponent} from "react";
import EntityFieldInput from "./EntityFieldInput";
import {useFormContext} from "react-hook-form";
import {FormattedMessage} from "react-intl";
import {FormControl} from "@material-ui/core";
import {SxProps} from "@material-ui/system";
import {Theme} from "@material-ui/core/styles";
import EntityFieldComponentLabel from "./EntityFieldComponentLabel";
import EntityFieldComponentError from "./EntityFieldComponentError";
import {EntityField} from "../../../models/entity";

interface IProps {
  entityField: EntityField;
  defaultValue?: any;
  disabled?: boolean;
  onValueChanged?: (value: any) => void;
  sx?: SxProps<Theme>;
}

const EntityFieldComponent: FunctionComponent<IProps> = ({entityField, defaultValue, disabled, onValueChanged, sx}) => {
  const methods = useFormContext();
  const {errors} = methods.formState;
  const error = errors[entityField.name];
  const hasError = !!error;

  return (
    <FormControl size="small" variant="outlined" error={hasError} sx={{display: "block", ...sx}}>
      <EntityFieldComponentLabel required={entityField.required}>
        <FormattedMessage id={entityField.titleKey} />
      </EntityFieldComponentLabel>

      <EntityFieldInput
        entityField={entityField}
        defaultValue={defaultValue}
        disabled={disabled}
        onValueChanged={onValueChanged}
      />

      <EntityFieldComponentError error={error?.message} />
    </FormControl>
  );
};
export default EntityFieldComponent;

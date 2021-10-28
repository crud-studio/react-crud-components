import React, {FunctionComponent} from "react";
import EntityFieldInput from "./EntityFieldInput";
import {useFormContext} from "react-hook-form";
import {FormattedMessage} from "react-intl";
import {FormControl} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
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
    <FormControl variant="outlined" error={hasError} sx={{display: "block", ...sx}}>
      <EntityFieldComponentLabel entityField={entityField} />

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

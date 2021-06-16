import React, {FunctionComponent} from "react";
import EntityColumnInput from "./EntityColumnInput";
import {useFormContext} from "react-hook-form";
import {FormattedMessage} from "react-intl";
import {FormControl} from "@material-ui/core";
import {SxProps} from "@material-ui/system";
import {Theme} from "@material-ui/core/styles";
import EntityColumnComponentLabel from "./EntityColumnComponentLabel";
import EntityColumnComponentError from "./EntityColumnComponentError";
import {EntityColumn} from "../../../models/entity";

interface IProps {
  column: EntityColumn;
  defaultValue?: any;
  disabled?: boolean;
  onValueChanged?: (value: any) => void;
  sx?: SxProps<Theme>;
}

const EntityColumnComponent: FunctionComponent<IProps> = ({column, defaultValue, disabled, onValueChanged, sx}) => {
  const methods = useFormContext();
  const {errors} = methods.formState;
  const error = errors[column.name];
  const hasError = !!error;

  return (
    <FormControl size="small" variant="outlined" error={hasError} sx={{display: "block", ...sx}}>
      <EntityColumnComponentLabel required={column.required}>
        <FormattedMessage id={column.titleKey} />
      </EntityColumnComponentLabel>

      <EntityColumnInput
        column={column}
        defaultValue={defaultValue}
        disabled={disabled}
        onValueChanged={onValueChanged}
      />

      <EntityColumnComponentError error={error?.message} />
    </FormControl>
  );
};
export default EntityColumnComponent;

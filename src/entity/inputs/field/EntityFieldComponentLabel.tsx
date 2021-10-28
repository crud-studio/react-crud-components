import React, {FunctionComponent, useMemo} from "react";
import {FormLabel, FormLabelProps} from "@mui/material";
import {EntityColumnTypeConfig, EntityField} from "../../../models/entity";
import {FormattedMessage} from "react-intl";
import {entityColumnTypes} from "../../column-types/entityColumnTypes";

interface IProps extends FormLabelProps {
  entityField: EntityField;
}

const EntityFieldComponentLabel: FunctionComponent<IProps> = ({entityField, children, sx, ...rest}) => {
  const entityColumnTypeConfig = useMemo<EntityColumnTypeConfig>(
    () => entityColumnTypes[entityField.type],
    [entityField]
  );

  if (!entityColumnTypeConfig.showComponentLabel) {
    return null;
  }

  return (
    <FormLabel required={entityField.required} sx={{display: "block", mb: 1, ...sx}} {...rest}>
      {children ? children : <FormattedMessage id={entityField.titleKey} defaultMessage={entityField.titleKey} />}
    </FormLabel>
  );
};
export default EntityFieldComponentLabel;

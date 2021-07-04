import React, {FunctionComponent} from "react";
import {FormLabel, FormLabelProps} from "@material-ui/core";

interface IProps extends FormLabelProps {}

const EntityFieldComponentLabel: FunctionComponent<IProps> = ({children, sx, ...rest}) => {
  return (
    <FormLabel sx={{display: "block", mb: 1, ...sx}} {...rest}>
      {children}
    </FormLabel>
  );
};
export default EntityFieldComponentLabel;

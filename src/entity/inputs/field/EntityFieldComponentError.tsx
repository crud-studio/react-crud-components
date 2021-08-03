import React, {FunctionComponent} from "react";
import {Box, FormHelperText} from "@material-ui/core";
import {ErrorOutlined} from "@material-ui/icons";

interface IProps {
  error?: string;
}

const EntityFieldComponentError: FunctionComponent<IProps> = ({error}) => {
  return (
    <>
      {error && (
        <Box sx={{position: "relative"}}>
          <FormHelperText
            error={true}
            sx={{
              position: "absolute",
              zIndex: 1,
              left: "50%",
              transform: "translate(-50%, 0)",
              mx: 0,
              mt: -2,
              p: 1,
              border: 1,
              borderColor: (theme) => theme.palette.error.main,
              display: "flex",
              alignItems: "center",
              maxWidth: "250px",
              borderRadius: (theme) => theme.shape.borderRadius,
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <ErrorOutlined fontSize="small" sx={{mr: 1}} />
            {error}
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: (theme) => `10px solid ${theme.palette.error.main}`,
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translate(-50%, 0)",
              }}
            />
          </FormHelperText>
        </Box>
      )}
    </>
  );
};
export default EntityFieldComponentError;

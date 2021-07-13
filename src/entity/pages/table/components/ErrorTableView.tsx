import React, {FunctionComponent} from "react";
import {FormattedMessage} from "react-intl";
import {Box, TableCell, TableRow, Typography} from "@material-ui/core";

const ErrorTableView: FunctionComponent = () => {
  return (
    <TableRow>
      <TableCell colSpan={999}>
        <Typography
          variant="body2"
          component="div"
          sx={{
            textAlign: "center",
            color: "text.disabled",
            position: "absolute",
            left: 0,
            right: 0,
            my: 1,
          }}
        >
          <FormattedMessage id="pages.error-retrieving-data" />
        </Typography>
        <Box sx={{my: 1, visibility: "hidden"}}>&nbsp;</Box>
      </TableCell>
    </TableRow>
  );
};
export default React.memo(ErrorTableView);

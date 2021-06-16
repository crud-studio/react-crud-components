import React, {FunctionComponent} from "react";
import {Box, CircularProgress, TableCell, TableRow} from "@material-ui/core";

const LoadingTableView: FunctionComponent = () => {
  return (
    <TableRow>
      <TableCell colSpan={999}>
        <Box
          sx={{
            textAlign: "center",
            position: "absolute",
            left: 0,
            right: 0,
          }}
        >
          <CircularProgress size={20} sx={{my: 0.5}} />
        </Box>
        <CircularProgress size={20} sx={{my: 0.5, visibility: "hidden"}} />
      </TableCell>
    </TableRow>
  );
};
export default React.memo(LoadingTableView);

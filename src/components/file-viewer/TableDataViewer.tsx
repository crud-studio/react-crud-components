import React, {FunctionComponent, useMemo} from "react";
import _ from "lodash";
import {Box, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";

interface IProps {
  data?: any[][];
}

const MAX_ROWS_TO_SHOW = 5;

const TableDataViewer: FunctionComponent<IProps> = ({data}) => {
  const headers = useMemo<any[]>(() => (!!data && data.length ? data[0] : []), [data]);
  const values = useMemo<any[][]>(() => (!!data && data.length ? _.slice(data, 1, 1 + MAX_ROWS_TO_SHOW) : []), [data]);

  return (
    <Box sx={{textAlign: "center"}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            {headers.map((value: any, index: number) => {
              return <TableCell key={index}>{value}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((rowValues: any, index: number) => {
            return (
              <TableRow key={index}>
                <TableCell scope="row">{index + 1}</TableCell>
                {rowValues.map((value: any, index: number) => {
                  return <TableCell key={index}>{value}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Typography variant="body2" sx={{color: "text.secondary", display: "block", mt: 2}}>
        <FormattedMessage
          id="pages.showing-rows-preview"
          values={{
            visibleRows: Math.min(values.length, MAX_ROWS_TO_SHOW),
            totalRows: values.length,
          }}
        />
      </Typography>
    </Box>
  );
};
export default TableDataViewer;

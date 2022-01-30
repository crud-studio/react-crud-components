import React, {FunctionComponent, useState} from "react";
import _ from "lodash";
import {FormattedMessage, useIntl} from "react-intl";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {EntityColumn} from "../../../../../models/entity";
import DialogContentTitle from "../../../../../components/common/DialogContentTitle";
import DialogContentSubTitle from "../../../../../components/common/DialogContentSubTitle";
import useEntity from "../../../../contexts/entity/hooks/useEntity";

interface IProps {
  column: EntityColumn;
  fileData: unknown[];
  maxRows: number;
  allowSkip: boolean;
  allowBack: boolean;
  onColumnSelected: (columnIndex: number) => void;
  onColumnBack: () => void;
  onColumnSkipped: () => void;
}

const ImportColumnSelection: FunctionComponent<IProps> = ({
  column,
  fileData,
  maxRows,
  allowSkip,
  allowBack,
  onColumnSelected,
  onColumnBack,
  onColumnSkipped,
}) => {
  const MAX_ROWS_TO_SHOW = 5;

  const intl = useIntl();
  const {isColumnValueValid} = useEntity();

  const head: unknown = _.head(fileData);
  const tail: unknown[] = _.slice(fileData, 1, 1 + MAX_ROWS_TO_SHOW);

  const visibleRows = tail.length;
  const totalRows = fileData.length - 1;

  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | undefined>(undefined);
  const [selectedColumnValid, setSelectedColumnValid] = useState(true);

  const isColumnValid = (columnIndex: number, data: unknown[]) => {
    if (!data) {
      return true;
    }

    return !_.some(data, (row) => {
      if (_.isArray(row)) {
        return !isColumnValueValid(column, row[columnIndex]);
      }
      return true;
    });
  };

  const onColumnClicked = (columnIndex: number): void => {
    setSelectedColumnIndex(columnIndex);
    setSelectedColumnValid(isColumnValid(columnIndex, tail));
  };

  const onNextClicked = (): void => {
    if (!_.isNumber(selectedColumnIndex)) {
      return;
    }

    if (onColumnSelected) {
      onColumnSelected(selectedColumnIndex);
    }

    setSelectedColumnIndex(undefined);
  };

  const onBackClicked = (): void => {
    if (onColumnBack) {
      onColumnBack();
    }

    setSelectedColumnIndex(undefined);
  };

  const onSkipClicked = (): void => {
    if (onColumnSkipped) {
      onColumnSkipped();
    }

    setSelectedColumnIndex(undefined);
  };

  const validTotalRows = totalRows <= maxRows;

  return (
    <>
      <DialogContent sx={{textAlign: "center"}}>
        <DialogContentTitle sx={{mb: 0}}>
          <FormattedMessage
            id="pages.import-column-selection"
            values={{columnTitle: intl.formatMessage({id: column.titleKey})}}
          />
        </DialogContentTitle>
        <DialogContentSubTitle>
          <FormattedMessage
            id="pages.import-column-selection-explanation"
            values={{columnTitle: intl.formatMessage({id: column.titleKey})}}
          />
        </DialogContentSubTitle>

        {!selectedColumnValid && (
          <Alert severity="warning" sx={{mb: 2}}>
            <FormattedMessage id="pages.import-invalid-column-values" />
          </Alert>
        )}

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{width: "1px"}}>#</TableCell>
                {_.isArray(head) &&
                  head.map((value, index) => {
                    return (
                      <TableCell
                        align="center"
                        sx={{
                          cursor: "pointer",
                          ...(selectedColumnIndex === index
                            ? {backgroundColor: (theme) => theme.palette.action.selected}
                            : {}),
                        }}
                        onClick={(e) => onColumnClicked(index)}
                        key={index}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {tail &&
                tail.map((values, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{width: "1px"}}>{index + 1}</TableCell>
                      {_.isArray(values) &&
                        values.map((value, index) => {
                          return (
                            <TableCell
                              align="center"
                              sx={{
                                cursor: "pointer",
                                ...(selectedColumnIndex === index
                                  ? {backgroundColor: (theme) => theme.palette.action.selected}
                                  : {}),
                              }}
                              onClick={(e) => onColumnClicked(index)}
                              key={index}
                            >
                              {value}
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            ...(validTotalRows ? {} : {color: (theme) => theme.palette.error.main}),
          }}
        >
          {validTotalRows ? (
            <FormattedMessage id="pages.showing-rows" values={{visibleRows: visibleRows, totalRows: totalRows}} />
          ) : (
            <FormattedMessage
              id="pages.showing-rows-max"
              values={{visibleRows: visibleRows, totalRows: totalRows, maxRows: maxRows}}
            />
          )}
        </Typography>
      </DialogContent>

      <DialogActions>
        {allowSkip && (
          <Button color="secondary" variant="outlined" onClick={onSkipClicked}>
            <FormattedMessage id="pages.skip" />
          </Button>
        )}

        {allowBack && (
          <Button color="primary" variant="outlined" onClick={onBackClicked}>
            <FormattedMessage id="pages.back" />
          </Button>
        )}

        <Button
          color="primary"
          onClick={onNextClicked}
          disabled={!_.isNumber(selectedColumnIndex)}
          className="btn-shadow"
        >
          <FormattedMessage id="pages.next" />
        </Button>
      </DialogActions>
    </>
  );
};
export default ImportColumnSelection;

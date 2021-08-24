import React, {ChangeEvent, FunctionComponent, useState} from "react";
import {useEffectOnce, useUpdateEffect} from "react-use";
import _ from "lodash";
import {FilterFieldOperation} from "@crud-studio/react-crud-core";
import {IconButton, InputAdornment, TextField} from "@material-ui/core";
import {Clear} from "@material-ui/icons";
import {useIntl} from "react-intl";
import {EntityColumn} from "../../../../models/entity";
import EntityUtils from "../../../helpers/EntityUtils";
import useFilters from "../../../hooks/useFilters";

interface IProps {
  column: EntityColumn;
  inputType: string;
  operation: FilterFieldOperation;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFilterValueValid?: (filterValue: string) => boolean;
  filterValueTransformer?: (filterValue: string) => any;
}

const TableFilterInput: FunctionComponent<IProps> = ({
  column,
  inputType,
  operation,
  onInput,
  isFilterValueValid,
  filterValueTransformer,
}) => {
  const intl = useIntl();

  const {contextFilterFields, contextFilterFieldsClearedFlag, updateContextFilterField, removeContextFilterField} =
    useFilters();

  const [value, setValue] = useState<string>("");

  useEffectOnce(() => {
    if (!!contextFilterFields?.length) {
      const filterField = _.find(contextFilterFields, {fieldName: EntityUtils.getColumnFilterFieldName(column)});
      if (filterField) {
        setValue(_.get(filterField.values, "[0]") || "");
      }
    }
  });

  useUpdateEffect(() => {
    if (value) {
      setValue("");
    }
  }, [contextFilterFieldsClearedFlag]);

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onFilterValueChange(e.target.value);
  };

  const onFilterValueChange = (filterValue: string): void => {
    setValue(filterValue);

    if (!!filterValue && (!isFilterValueValid || isFilterValueValid(filterValue))) {
      const transformedFilterValue = !!filterValueTransformer ? filterValueTransformer(filterValue) : filterValue;
      updateContextFilterField(
        {
          fieldName: EntityUtils.getColumnFilterFieldName(column),
          operation: operation,
          values: [transformedFilterValue],
        },
        true
      );
    } else {
      removeContextFilterField(EntityUtils.getColumnFilterFieldName(column), true);
    }
  };

  return (
    <>
      <TextField
        type={inputType}
        value={value || ""}
        placeholder={intl.formatMessage({id: "pages.search"})}
        onChange={onFilterChange}
        fullWidth
        size="small"
        autoComplete="off"
        inputProps={{
          onInput: onInput,
        }}
        InputProps={{
          endAdornment: !!value ? (
            <InputAdornment position="end">
              <IconButton aria-label="clear filter" size="small" onClick={() => onFilterValueChange("")}>
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
    </>
  );
};
export default TableFilterInput;

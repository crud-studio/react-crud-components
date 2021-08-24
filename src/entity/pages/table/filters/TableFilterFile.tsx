import React, {FunctionComponent, useState} from "react";
import {useEffectOnce, useUpdateEffect} from "react-use";
import _ from "lodash";
import {Autocomplete, TextField} from "@material-ui/core";
import {IPropsEntityColumnFilter} from "../../../../models/props";
import {useIntl} from "react-intl";
import {SelectOption} from "../../../../models/internal";
import EntityUtils from "../../../helpers/EntityUtils";
import useFilters from "../../../hooks/useFilters";
import {FilterFieldOperation} from "@crud-studio/react-crud-core";

export interface FilterFieldOperationOption {
  label: string;
  value: FilterFieldOperation;
}

const TableFilterFile: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  const intl = useIntl();

  const {contextFilterFields, contextFilterFieldsClearedFlag, updateContextFilterField, removeContextFilterField} =
    useFilters();

  const [value, setValue] = useState<FilterFieldOperation | undefined>(undefined);
  const [options] = useState<FilterFieldOperationOption[]>([
    {value: "IsNotNull", label: intl.formatMessage({id: "pages.yes"})},
    {value: "IsNull", label: intl.formatMessage({id: "pages.no"})},
  ]);

  useEffectOnce(() => {
    if (!!contextFilterFields?.length) {
      const filterField = _.find(contextFilterFields, {fieldName: EntityUtils.getColumnFilterFieldName(column)});
      if (filterField) {
        setValue(filterField.operation);
      }
    }
  });

  useUpdateEffect(() => {
    if (!!value) {
      setValue(undefined);
    }
  }, [contextFilterFieldsClearedFlag]);

  const onFilterChange = (event: React.SyntheticEvent, filterValue: FilterFieldOperationOption | null): void => {
    setValue(filterValue?.value);
    onFilterValueChange(filterValue?.value, true);
  };

  const onFilterValueChange = (filterOperation: FilterFieldOperation | undefined, debounced: boolean): void => {
    if (filterOperation) {
      updateContextFilterField(
        {
          fieldName: EntityUtils.getColumnFilterFieldName(column) + ".id",
          operation: filterOperation,
          values: [],
        },
        debounced
      );
    } else {
      removeContextFilterField(EntityUtils.getColumnFilterFieldName(column), debounced);
    }
  };

  const getSelectValue = (value: FilterFieldOperation | undefined): SelectOption | null => {
    if (!value) {
      return null;
    }

    if (!options) {
      return null;
    }

    return _.find(options, (option) => option.value === value) || null;
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option?.label}
      renderInput={(params) => (
        <TextField {...params} placeholder={intl.formatMessage({id: "pages.search"})} variant="outlined" />
      )}
      size="small"
      onChange={onFilterChange}
      value={getSelectValue(value)}
      fullWidth
    />
  );
};
export default TableFilterFile;

import React, {FunctionComponent, useContext, useState} from "react";
import {useEffectOnce, useUpdateEffect} from "react-use";
import {FiltersContext} from "../../../managers/FilterManager";
import _ from "lodash";
import {Autocomplete, TextField} from "@material-ui/core";
import {IPropsEntityColumnFilter} from "../../../../models/props";
import {useIntl} from "react-intl";
import {SelectOption} from "../../../../models/internal";
import {EntityContext} from "../../../managers/EntityManager";
import EntityUtils from "../../../helpers/EntityUtils";

const TableFilterEnum: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  const intl = useIntl();

  const {getEnumSelectOptions, getEnumValuesSelectOptions} = useContext(EntityContext);
  const {contextFilterFields, contextFilterFieldsClearedFlag, updateContextFilterField, removeContextFilterField} =
    useContext(FiltersContext);

  const [value, setValue] = useState<SelectOption[]>([]);
  const [options] = useState<SelectOption[]>(column.subtype ? getEnumSelectOptions(column.subtype) : []);

  useEffectOnce(() => {
    if (!!contextFilterFields?.length) {
      const filterField = _.find(contextFilterFields, {fieldName: column.name});
      if (filterField && column.subtype) {
        setValue(getEnumValuesSelectOptions(column.subtype, filterField.values || []));
      }
    }
  });

  useUpdateEffect(() => {
    if (value) {
      setValue([]);
    }
  }, [contextFilterFieldsClearedFlag]);

  const onFilterChange = (event: React.SyntheticEvent, filterValue: SelectOption[] | null): void => {
    if (filterValue) {
      setValue(filterValue);
      onFilterValueChange(filterValue, true);
    } else {
      setValue([]);
      onFilterValueChange([], true);
    }
  };

  const onFilterValueChange = (filterValue: SelectOption[], debounced: boolean): void => {
    if (filterValue && !_.isEmpty(filterValue)) {
      updateContextFilterField(
        {
          fieldName: EntityUtils.getColumnFilterFieldName(column),
          operation: "In",
          values: filterValue.map((option) => option.value),
        },
        debounced
      );
    } else {
      removeContextFilterField(EntityUtils.getColumnFilterFieldName(column), debounced);
    }
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
      value={value}
      multiple
      limitTags={1}
      fullWidth
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};
export default TableFilterEnum;

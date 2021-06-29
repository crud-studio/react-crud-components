import React, {FunctionComponent, useContext, useState} from "react";
import {useEffectOnce, useUpdateEffect} from "react-use";
import _ from "lodash";
import {FiltersContext} from "../../../managers/FilterManager";
import {Autocomplete, TextField} from "@material-ui/core";
import {IPropsEntityColumnFilter} from "../../../../models/props";
import {useIntl} from "react-intl";
import {SelectOption} from "../../../../models/internal";
import EntityUtils from "../../../helpers/EntityUtils";

const TableFilterBoolean: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  const intl = useIntl();

  const {contextFilterFields, contextFilterFieldsClearedFlag, updateContextFilterField, removeContextFilterField} =
    useContext(FiltersContext);

  const [values, setValues] = useState<any[]>([]);
  const [options] = useState<SelectOption[]>([
    {value: "true", label: intl.formatMessage({id: "pages.yes"})},
    {value: "false", label: intl.formatMessage({id: "pages.no"})},
  ]);

  useEffectOnce(() => {
    if (!!contextFilterFields?.length) {
      const filterField = _.find(contextFilterFields, {fieldName: EntityUtils.getColumnFilterFieldName(column)});
      if (filterField) {
        setValues(filterField.values || []);
      }
    }
  });

  useUpdateEffect(() => {
    if (!!values.length) {
      setValues([]);
    }
  }, [contextFilterFieldsClearedFlag]);

  const onFilterChange = (event: React.SyntheticEvent, filterValue: SelectOption | null): void => {
    if (filterValue) {
      setValues([filterValue.value]);
      onFilterValueChange([filterValue.value || ""], true);
    } else {
      setValues([]);
      onFilterValueChange([], true);
    }
  };

  const onFilterValueChange = (filterValue: string[], debounced: boolean): void => {
    if (filterValue && !_.isEmpty(filterValue)) {
      updateContextFilterField(
        {
          fieldName: EntityUtils.getColumnFilterFieldName(column),
          operation: "Equal",
          values: filterValue,
        },
        debounced
      );
    } else {
      removeContextFilterField(EntityUtils.getColumnFilterFieldName(column), debounced);
    }
  };

  const getSelectValue = (values: any[] | null): SelectOption | null => {
    if (!values || _.isEmpty(values)) {
      return null;
    }

    if (!options) {
      return null;
    }

    const valueString = _.toString(values[0]);
    return _.find(options, (option) => option.value === valueString) || null;
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
      value={getSelectValue(values)}
      fullWidth
    />
  );
};
export default TableFilterBoolean;

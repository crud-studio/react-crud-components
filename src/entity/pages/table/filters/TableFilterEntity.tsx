import React, {FunctionComponent, useState} from "react";
import {useEffectOnce} from "react-use";
import _ from "lodash";
import {IPropsEntityColumnFilter} from "../../../../models/props";
import {Entity} from "../../../../models/entity";
import AsyncCreatableEntitySelect from "../../../inputs/AsyncCreatableEntitySelect";
import {useIntl} from "react-intl";
import EntityUtils from "../../../helpers/EntityUtils";
import useEntity from "../../../contexts/entity/hooks/useEntity";
import useFilters from "../../../contexts/filter/hooks/useFilters";

const TableFilterEntity: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  const intl = useIntl();

  const {getEntity} = useEntity();
  const {contextFilterFields, contextFilterFieldsClearedFlag, updateContextFilterField, removeContextFilterField} =
    useFilters();

  const [entity] = useState<Entity<any>>(getEntity(column.subtype));
  const [initialValueIds, setInitialValueIds] = useState<number[] | undefined>(undefined);

  useEffectOnce(() => {
    if (!!contextFilterFields?.length) {
      const filterField = _.find(contextFilterFields, {fieldName: EntityUtils.getColumnFilterFieldName(column)});
      if (filterField?.values) {
        setInitialValueIds(filterField.values);
      }
    }
  });

  const onFilterChange = (filterValue: number[]): void => {
    onFilterValueChange(filterValue, true);
  };

  const onFilterValueChange = (filterValue: number[], debounced: boolean): void => {
    if (filterValue && !_.isEmpty(filterValue)) {
      updateContextFilterField(
        {
          fieldName: EntityUtils.getColumnFilterFieldName(column),
          operation: "In",
          values: filterValue,
        },
        debounced
      );
    } else {
      removeContextFilterField(EntityUtils.getColumnFilterFieldName(column), debounced);
    }
  };

  return (
    <AsyncCreatableEntitySelect
      entity={entity}
      initialValueIds={initialValueIds}
      clearFlag={contextFilterFieldsClearedFlag}
      cache={true}
      lazy={true}
      onEntityChange={(newValue) => onFilterChange(_.isArray(newValue) ? newValue.map((v) => v.id) : [])}
      placeholder={intl.formatMessage({id: "pages.search"})}
      multiple={true}
      disableCloseOnSelect
      size="small"
      limitTags={1}
      fullWidth
    />
  );
};
export default TableFilterEntity;

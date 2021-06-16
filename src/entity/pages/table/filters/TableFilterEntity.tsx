import React, {FunctionComponent, useContext, useState} from "react";
import {useEffectOnce} from "react-use";
import {FiltersContext} from "../../../managers/FilterManager";
import _ from "lodash";
import {IPropsEntityColumnFilter} from "../../../../models/props";
import {Entity} from "../../../../models/entity";
import AsyncCreatableEntitySelect from "../../../inputs/AsyncCreatableEntitySelect";
import {useIntl} from "react-intl";
import {EntityContext} from "../../../managers/EntityManager";

const TableFilterEntity: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  const intl = useIntl();

  const {getEntity} = useContext(EntityContext);
  const {contextFilterFields, contextFilterFieldsClearedFlag, updateContextFilterField, removeContextFilterField} =
    useContext(FiltersContext);

  const [entity] = useState<Entity<any>>(getEntity(column.subtype));
  const [initialValueIds, setInitialValueIds] = useState<number[] | undefined>(undefined);

  useEffectOnce(() => {
    if (!!contextFilterFields?.length) {
      const filterField = _.find(contextFilterFields, {fieldName: column.name});
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
          fieldName: column.name,
          operation: "In",
          values: filterValue,
        },
        debounced
      );
    } else {
      removeContextFilterField(column.name, debounced);
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
      placeholder={intl.formatMessage({ id: "pages.search"})}
      multiple={true}
      disableCloseOnSelect
      size="small"
      limitTags={1}
      fullWidth
    />
  );
};
export default TableFilterEntity;

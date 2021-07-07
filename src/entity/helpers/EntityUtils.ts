import _ from "lodash";
import {PartialDeep} from "type-fest";
import {
  Entity,
  EntityColumn,
  EntityComponentActionConfig,
  EntityComponentActionConfigMany,
  EntityField,
  EntityGenericActionConfig,
  EntityGenericActionConfigMany,
} from "../../models/entity";
import {entityColumnTypes} from "../column-types/entityColumnTypes";

const EntityUtils = {
  getFieldDefaultValue: function (entityField: EntityField): any {
    return entityColumnTypes[entityField.type].getDefaultValue(entityField);
  },

  getItemFieldDefaultValue: function (entityField: EntityField, item: any): any {
    return _.get(item, entityField.name);
  },

  getItemsFieldDefaultValue: function (entityField: EntityField, items: any[]): any {
    const defaultValue = _.get(items, `[0].${entityField.name}`);
    if (_.some(items, (item) => !_.isEqual(defaultValue, _.get(item, entityField.name)))) {
      return this.getFieldDefaultValue(entityField);
    }
    return defaultValue;
  },

  isEntityValid: function <EntityRO>(entity: Entity<EntityRO>, item: PartialDeep<EntityRO>): boolean {
    return !_.chain(entity.columns)
      .filter((column) => !!column.required)
      .some((column) => _.isNil(_.get(item, column.name)))
      .value();
  },

  getColumnFilterFieldName: function (column: EntityColumn): string {
    return column.filterName || column.name;
  },

  getColumnDisplayFieldName: function (column: EntityColumn): string {
    return column.displayName || column.name;
  },

  isEntityGenericActionConfig: function (
    actionConfig: EntityGenericActionConfig<any> | EntityComponentActionConfig<any>
  ): actionConfig is EntityGenericActionConfig<any> {
    return "api" in actionConfig;
  },

  isEntityComponentActionConfig: function (
    actionConfig: EntityGenericActionConfig<any> | EntityComponentActionConfig<any>
  ): actionConfig is EntityComponentActionConfig<any> {
    return "component" in actionConfig;
  },

  isEntityGenericActionConfigMany: function (
    actionConfig: EntityGenericActionConfigMany<any> | EntityComponentActionConfigMany<any>
  ): actionConfig is EntityGenericActionConfigMany<any> {
    return "api" in actionConfig;
  },

  isEntityComponentActionConfigMany: function (
    actionConfig: EntityGenericActionConfigMany<any> | EntityComponentActionConfigMany<any>
  ): actionConfig is EntityComponentActionConfigMany<any> {
    return "component" in actionConfig;
  },
};
export default EntityUtils;

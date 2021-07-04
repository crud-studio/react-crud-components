import _ from "lodash";
import {PartialDeep} from "type-fest";
import {Entity, EntityColumn, EntityField} from "../../models/entity";
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
};
export default EntityUtils;

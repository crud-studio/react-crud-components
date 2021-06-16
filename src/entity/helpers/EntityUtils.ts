import _ from "lodash";
import {PartialDeep} from "type-fest";
import {Entity, EntityColumn} from "../../models/entity";
import {entityColumnTypes} from "../column-types/entityColumnTypes";

const EntityUtils = {
  getColumnDefaultValue: function (column: EntityColumn): any {
    return entityColumnTypes[column.type].getDefaultValue(column);
  },

  getItemColumnDefaultValue: function (column: EntityColumn, item: any): any {
    return _.get(item, column.name);
  },

  getItemsColumnDefaultValue: function (column: EntityColumn, items: any[]): any {
    const defaultValue = _.get(items, `[0].${column.name}`);
    if (_.some(items, (item) => !_.isEqual(defaultValue, _.get(item, column.name)))) {
      return this.getColumnDefaultValue(column);
    }
    return defaultValue;
  },

  isEntityValid: function <EntityRO>(entity: Entity<EntityRO>, item: PartialDeep<EntityRO>): boolean {
    return !_.chain(entity.columns)
      .filter((column) => !!column.required)
      .some((column) => _.isNil(_.get(item, column.name)))
      .value();
  },

  isColumnValueValid: function (column: EntityColumn, value: unknown, required: boolean = false): boolean {
    return (!required && _.isNil(value)) || !_.isNil(this.parseColumnValue(column, value));
  },

  parseColumnValue: function (column: EntityColumn, value: unknown): any {
    if (_.isNil(value)) {
      return value;
    }
    return entityColumnTypes[column.type].parseValue(column, value);
  },
};
export default EntityUtils;

import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {Entity, EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import TableFilterEntity from "../pages/table/filters/TableFilterEntity";
import TableDataEntity from "../pages/table/data/TableDataEntity";
import {DIGITS_REGEX} from "../../constants/regex";
import EntityUtils from "../helpers/EntityUtils";
import EntityFieldInputEntity from "../inputs/field/inputs/EntityFieldInputEntity";

export const entityColumnType: EntityColumnTypeConfig = {
  type: "Entity",
  inputComponent: EntityFieldInputEntity,
  filterComponent: TableFilterEntity,
  dataComponent: TableDataEntity,
  getDefaultValue(column: EntityColumn): any {
    return undefined;
  },
  parseValue(column: EntityColumn, value: unknown): number | undefined {
    if (_.isNumber(value)) {
      return value;
    }
    if (_.isString(value) && !!value && DIGITS_REGEX.test(value)) {
      return _.parseInt(value);
    }
    return undefined;
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    return !!search && DIGITS_REGEX.test(search);
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: EntityUtils.getColumnFilterFieldName(column), operation: "Equal", values: [search]};
  },
  getGrant(column: EntityColumn, entityMap: {[key: string]: Entity<any>}): string | undefined {
    const columnEntity = entityMap[column.subtype || ""];
    if (columnEntity) {
      return EntityUtils.getEntityActionGrant(columnEntity, "READ");
    }
    return undefined;
  },
};

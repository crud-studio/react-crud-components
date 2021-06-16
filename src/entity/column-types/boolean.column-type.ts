import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import EntityColumnInputBoolean from "../pages/details/inputs/EntityColumnInputBoolean";
import TableFilterBoolean from "../pages/table/filters/TableFilterBoolean";
import TableDataBoolean from "../pages/table/data/TableDataBoolean";

export const booleanColumnType: EntityColumnTypeConfig = {
  type: "Boolean",
  inputComponent: EntityColumnInputBoolean,
  filterComponent: TableFilterBoolean,
  dataComponent: TableDataBoolean,
  getDefaultValue(column: EntityColumn): boolean {
    return false;
  },
  parseValue(column: EntityColumn, value: unknown): boolean | undefined {
    if (_.isBoolean(value)) {
      return value;
    }
    if (_.isString(value)) {
      const lowerCaseValue = _.toLower(_.trim(value));
      if (lowerCaseValue === "true" || lowerCaseValue === "yes") {
        return true;
      }
      if (lowerCaseValue === "false" || lowerCaseValue === "no") {
        return true;
      }
    }
    return undefined;
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    return search === "true" || search === "false";
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: column.name, operation: "Equal", values: [search]};
  },
};

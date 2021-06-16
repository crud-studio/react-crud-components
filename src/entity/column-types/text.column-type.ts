import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import EntityColumnInputText from "../pages/details/inputs/EntityColumnInputText";
import TableFilterText from "../pages/table/filters/TableFilterText";
import TableDataText from "../pages/table/data/TableDataText";

export const textColumnType: EntityColumnTypeConfig = {
  type: "Text",
  inputComponent: EntityColumnInputText,
  filterComponent: TableFilterText,
  dataComponent: TableDataText,
  getDefaultValue(column: EntityColumn): string {
    return "";
  },
  parseValue(column: EntityColumn, value: unknown): string | undefined {
    if (_.isObject(value)) {
      return JSON.stringify(value);
    }
    return _.toString(value);
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    return true;
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: column.name, operation: "Contains", values: [search]};
  },
};

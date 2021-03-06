import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import TableFilterText from "../pages/table/filters/TableFilterText";
import TableDataText from "../pages/table/data/TableDataText";
import EntityUtils from "../helpers/EntityUtils";
import EntityFieldInputText from "../inputs/field/inputs/EntityFieldInputText";

export const textColumnType: EntityColumnTypeConfig = {
  type: "Text",
  showComponentLabel: false,
  inputComponent: EntityFieldInputText,
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
    return {fieldName: EntityUtils.getColumnFilterFieldName(column), operation: "Contains", values: [search]};
  },
  getGrant(column: EntityColumn): string | undefined {
    return undefined;
  },
};

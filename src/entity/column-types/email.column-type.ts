import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import TableFilterText from "../pages/table/filters/TableFilterText";
import EntityUtils from "../helpers/EntityUtils";
import EntityFieldInputEmail from "../inputs/field/inputs/EntityFieldInputEmail";
import TableDataEmail from "../pages/table/data/TableDataEmail";

export const emailColumnType: EntityColumnTypeConfig = {
  type: "Email",
  showComponentLabel: false,
  inputComponent: EntityFieldInputEmail,
  filterComponent: TableFilterText,
  dataComponent: TableDataEmail,
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

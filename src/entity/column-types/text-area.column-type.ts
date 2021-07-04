import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import EntityFieldInputTextArea from "../pages/details/inputs/EntityFieldInputTextArea";
import TableFilterText from "../pages/table/filters/TableFilterText";
import TableDataTextArea from "../pages/table/data/TableDataTextArea";
import EntityUtils from "../helpers/EntityUtils";

export const textAreaColumnType: EntityColumnTypeConfig = {
  type: "TextArea",
  inputComponent: EntityFieldInputTextArea,
  filterComponent: TableFilterText,
  dataComponent: TableDataTextArea,
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
};

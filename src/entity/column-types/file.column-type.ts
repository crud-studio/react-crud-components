import _ from "lodash";
import {FilterField, MinimalMediaFileRO} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import EntityUtils from "../helpers/EntityUtils";
import TableDataFile from "../pages/table/data/TableDataFile";
import TableFilterFile from "../pages/table/filters/TableFilterFile";
import EntityFieldInputFile from "../inputs/field/inputs/EntityFieldInputFile";
import {INTEGER_REGEX} from "../../constants/regex";

export const fileColumnType: EntityColumnTypeConfig = {
  type: "File",
  showComponentLabel: false,
  inputComponent: EntityFieldInputFile,
  filterComponent: TableFilterFile,
  dataComponent: TableDataFile,
  getDefaultValue(column: EntityColumn): MinimalMediaFileRO | undefined {
    return undefined;
  },
  parseValue(column: EntityColumn, value: unknown): MinimalMediaFileRO | undefined {
    if (_.isNumber(value)) {
      return {id: value};
    }
    if (_.isString(value) && !!value && INTEGER_REGEX.test(value)) {
      return {id: _.parseInt(value)};
    }
    const id = _.get(value, "id");
    if (_.isNumber(id)) {
      return {id: id};
    }
    return undefined;
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    return search === "true" || search === "false";
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {
      fieldName: EntityUtils.getColumnFilterFieldName(column),
      operation: search === "true" ? "IsNotNull" : "IsNull",
      values: [],
    };
  },
  getGrant(column: EntityColumn): string | undefined {
    return undefined;
  },
};

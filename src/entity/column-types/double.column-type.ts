import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import TableFilterDouble from "../pages/table/filters/TableFilterDouble";
import TableDataNumber from "../pages/table/data/TableDataNumber";
import {FLOAT_REGEX} from "../../constants/regex";
import EntityUtils from "../helpers/EntityUtils";
import EntityFieldInputDouble from "../inputs/field/inputs/EntityFieldInputDouble";

export const doubleColumnType: EntityColumnTypeConfig = {
  type: "Double",
  showComponentLabel: false,
  inputComponent: EntityFieldInputDouble,
  filterComponent: TableFilterDouble,
  dataComponent: TableDataNumber,
  getDefaultValue(column: EntityColumn): number {
    return 0;
  },
  parseValue(column: EntityColumn, value: unknown): number | undefined {
    if (_.isNumber(value)) {
      return value;
    }
    if (_.isString(value) && !!value && FLOAT_REGEX.test(value)) {
      return parseFloat(value);
    }
    return undefined;
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    return !!search && FLOAT_REGEX.test(search);
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: EntityUtils.getColumnFilterFieldName(column), operation: "Equal", values: [parseFloat(search)]};
  },
  getGrant(column: EntityColumn): string | undefined {
    return undefined;
  },
};

import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import TableFilterInteger from "../pages/table/filters/TableFilterInteger";
import TableDataNumber from "../pages/table/data/TableDataNumber";
import {INTEGER_REGEX} from "../../constants/regex";
import EntityUtils from "../helpers/EntityUtils";
import EntityFieldInputInteger from "../inputs/field/inputs/EntityFieldInputInteger";

export const integerColumnType: EntityColumnTypeConfig = {
  type: "Integer",
  showComponentLabel: false,
  inputComponent: EntityFieldInputInteger,
  filterComponent: TableFilterInteger,
  dataComponent: TableDataNumber,
  getDefaultValue(column: EntityColumn): number {
    return 0;
  },
  parseValue(column: EntityColumn, value: unknown): number | undefined {
    if (_.isNumber(value)) {
      return Math.round(value);
    }
    if (_.isString(value) && !!value && INTEGER_REGEX.test(value)) {
      return _.parseInt(value);
    }
    return undefined;
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    return !!search && INTEGER_REGEX.test(search);
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: EntityUtils.getColumnFilterFieldName(column), operation: "Equal", values: [_.parseInt(search)]};
  },
  getGrant(column: EntityColumn): string | undefined {
    return undefined;
  },
};

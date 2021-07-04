import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import {COMMA_SEPARATED_DIGITS_REGEX, DIGITS_REGEX} from "../../constants/regex";
import EntityFieldInputEntityList from "../pages/details/inputs/EntityFieldInputEntityList";
import TableDataEntityList from "../pages/table/data/TableDataEntityList";
import TableFilterEntity from "../pages/table/filters/TableFilterEntity";
import EntityUtils from "../helpers/EntityUtils";

export const entityListColumnType: EntityColumnTypeConfig = {
  type: "EntityList",
  inputComponent: EntityFieldInputEntityList,
  filterComponent: TableFilterEntity,
  dataComponent: TableDataEntityList,
  getDefaultValue(column: EntityColumn): any {
    return [];
  },
  parseValue(column: EntityColumn, value: unknown): number[] | undefined {
    if (_.isNumber(value)) {
      return [value];
    }
    if (_.isString(value) && !!value && DIGITS_REGEX.test(value)) {
      return [_.parseInt(value)];
    }
    if (_.isString(value) && !!value && COMMA_SEPARATED_DIGITS_REGEX.test(value)) {
      return value.split(",").map((v) => _.parseInt(v));
    }
    return [];
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    return !!search && DIGITS_REGEX.test(search);
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: EntityUtils.getColumnFilterFieldName(column), operation: "Equal", values: [search]};
  },
};

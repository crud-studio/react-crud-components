import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig, EnumInfoMap} from "../../models/entity";
import EntityFieldInputEnum from "../pages/details/inputs/EntityFieldInputEnum";
import TableFilterEnum from "../pages/table/filters/TableFilterEnum";
import TableDataEnum from "../pages/table/data/TableDataEnum";
import EntityUtils from "../helpers/EntityUtils";
import _ from "lodash";

export const enumColumnType: EntityColumnTypeConfig = {
  type: "Enum",
  inputComponent: EntityFieldInputEnum,
  filterComponent: TableFilterEnum,
  dataComponent: TableDataEnum,
  getDefaultValue(column: EntityColumn): any {
    return undefined;
  },
  parseValue(column: EntityColumn, value: unknown, enumMap: {[key: string]: EnumInfoMap<any>}): string | undefined {
    if (!column.subtype) {
      return undefined;
    }
    if (!value || !_.isString(value)) {
      return undefined;
    }
    return enumMap[column.subtype]?.get(value)?.value;
  },
  isSearchable(column: EntityColumn, search: string, enumMap: {[key: string]: EnumInfoMap<any>}): boolean {
    if (!column.subtype) {
      return false;
    }
    return !!enumMap[column.subtype]?.get(search);
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: EntityUtils.getColumnFilterFieldName(column), operation: "Equal", values: [search]};
  },
};

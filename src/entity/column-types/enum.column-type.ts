import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig, EnumInfoMap} from "../../models/entity";
import TableFilterEnum from "../pages/table/filters/TableFilterEnum";
import TableDataEnum from "../pages/table/data/TableDataEnum";
import EntityUtils from "../helpers/EntityUtils";
import _ from "lodash";
import EntityFieldInputEnum from "../inputs/field/inputs/EntityFieldInputEnum";

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
    if (!enumMap[column.subtype]?.get(value)) {
      return undefined;
    }
    return value;
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
  getGrant(column: EntityColumn): string | undefined {
    return undefined;
  },
};

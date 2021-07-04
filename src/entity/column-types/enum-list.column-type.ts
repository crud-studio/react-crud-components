import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig, EnumInfoMap} from "../../models/entity";
import TableFilterEnum from "../pages/table/filters/TableFilterEnum";
import EntityUtils from "../helpers/EntityUtils";
import _ from "lodash";
import {notEmpty} from "../../helpers/ObjectUtils";
import TableDataEnumList from "../pages/table/data/TableDataEnumList";
import EntityFieldInputEnumList from "../inputs/field/inputs/EntityFieldInputEnumList";

export const enumListColumnType: EntityColumnTypeConfig = {
  type: "EnumList",
  inputComponent: EntityFieldInputEnumList,
  filterComponent: TableFilterEnum,
  dataComponent: TableDataEnumList,
  getDefaultValue(column: EntityColumn): any {
    return [];
  },
  parseValue(column: EntityColumn, value: unknown, enumMap: {[key: string]: EnumInfoMap<any>}): string[] | undefined {
    if (!column.subtype) {
      return [];
    }
    if (!value || !_.isString(value)) {
      return [];
    }
    return value
      .split(",")
      .map((v) => enumMap[column.subtype || ""]?.get(v)?.value)
      .filter(notEmpty);
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

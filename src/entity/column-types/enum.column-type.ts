import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import EntityColumnInputEnum from "../pages/details/inputs/EntityColumnInputEnum";
import TableFilterEnum from "../pages/table/filters/TableFilterEnum";
import TableDataEnum from "../pages/table/data/TableDataEnum";

export const enumColumnType: EntityColumnTypeConfig = {
  type: "Enum",
  inputComponent: EntityColumnInputEnum,
  filterComponent: TableFilterEnum,
  dataComponent: TableDataEnum,
  getDefaultValue(column: EntityColumn): any {
    return undefined;
  },
  parseValue(column: EntityColumn, value: unknown): string | undefined {
    // if (!column.subtype) {
    //   return undefined;
    // }
    // return entityEnums[column.subtype]?.get(value)?.value;
    return undefined; // TODO: Find solution for enums
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    // if (!column.subtype) {
    //   return false;
    // }
    // return !!entityEnums[column.subtype]?.get(search);
    return false; // TODO: Find solution for enums
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: column.name, operation: "Equal", values: [search]};
  },
};

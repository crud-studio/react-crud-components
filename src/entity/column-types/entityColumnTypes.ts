import {EntityColumnTypeConfig} from "../../models/entity";
import {textColumnType} from "./text.column-type";
import {textAreaColumnType} from "./text-area.column-type";
import {numberColumnType} from "./number.column-type";
import {booleanColumnType} from "./boolean.column-type";
import {dateColumnType} from "./date.column-type";
import {enumColumnType} from "./enum.column-type";
import {entityColumnType} from "./entity.column-type";

export const entityColumnTypes: {[key: string]: EntityColumnTypeConfig} = {
  [textColumnType.type]: textColumnType,
  [textAreaColumnType.type]: textAreaColumnType,
  [numberColumnType.type]: numberColumnType,
  [booleanColumnType.type]: booleanColumnType,
  [dateColumnType.type]: dateColumnType,
  [enumColumnType.type]: enumColumnType,
  [entityColumnType.type]: entityColumnType,
};
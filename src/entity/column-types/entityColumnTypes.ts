import {EntityColumnTypeConfig} from "../../models/entity";
import {textColumnType} from "./text.column-type";
import {textAreaColumnType} from "./text-area.column-type";
import {booleanColumnType} from "./boolean.column-type";
import {dateColumnType} from "./date.column-type";
import {enumColumnType} from "./enum.column-type";
import {entityColumnType} from "./entity.column-type";
import {entityListColumnType} from "./entity-list.column-type";
import {enumListColumnType} from "./enum-list.column-type";
import {emailColumnType} from "./email.column-type";
import {integerColumnType} from "./integer.column-type";
import {doubleColumnType} from "./double.column-type";
import {fileColumnType} from "./file.column-type";

export const entityColumnTypes: {[key: string]: EntityColumnTypeConfig} = {
  [textColumnType.type]: textColumnType,
  [textAreaColumnType.type]: textAreaColumnType,
  [integerColumnType.type]: integerColumnType,
  [doubleColumnType.type]: doubleColumnType,
  [booleanColumnType.type]: booleanColumnType,
  [dateColumnType.type]: dateColumnType,
  [enumColumnType.type]: enumColumnType,
  [enumListColumnType.type]: enumListColumnType,
  [entityColumnType.type]: entityColumnType,
  [entityListColumnType.type]: entityListColumnType,
  [emailColumnType.type]: emailColumnType,
  [fileColumnType.type]: fileColumnType,
};

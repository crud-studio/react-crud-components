import {ReactNode, Ref} from "react";
import {
  Entity,
  EntityColumn,
  EntityComponentActionConfig,
  EntityComponentActionConfigMany,
  EntityField,
} from "./entity";
import {AutocompleteProps} from "@material-ui/core";
import {FilterField, OrderDTO} from "@crud-studio/react-crud-core";
import {PartialDeep} from "type-fest";

export interface IPropsEntitySelect<EntityRO> extends Partial<AutocompleteProps<EntityRO, any, any, false>> {
  id?: string;
  entity: Entity<EntityRO>;
  orders?: OrderDTO[];
  filterFields?: FilterField[];
  valueKey?: string;
  labelKey?: string;
  labelFn?: (item: EntityRO) => string;
  optionDataFn?: (item: EntityRO) => object;
  placeholderKey?: string;
  initialValue?: EntityRO | EntityRO[];
  initialValueIds?: number | number[];
  onEntityChange?: (newItem: EntityRO | EntityRO[] | null) => void;
  clearFlag?: number;
  maxValues?: number;
  cache?: boolean;
  lazy?: boolean;
  innerRef?: Ref<any>;
  fieldLabel?: ReactNode | string;
  fieldRequired?: boolean;
}

export interface IPropsEntityColumnInputType {
  entityField: EntityField;
  name: string;
  disabled?: boolean;
  defaultValue?: any;
  onValueChanged: (value: any) => void;
}

export interface IPropsEntityColumnFilter {
  column: EntityColumn;
}

export interface IPropsEntityColumnData<EntityRO> {
  column: EntityColumn;
  item: EntityRO;
}

export interface IPropsEntityComponentSummary<EntityRO> {
  entity: Entity<EntityRO>;
  item: EntityRO;
  refreshItem: () => void;
}

export interface IPropsEntityCustomTab<EntityRO> {
  entity: Entity<EntityRO>;
  item: EntityRO;
  setItem: (item: EntityRO & {uniqueKey?: string}) => void;
  refreshItem: () => void;
  updateItem: (itemData: PartialDeep<EntityRO>, debounced: boolean) => void;
}

export interface IPropsEntityComponentAction<EntityRO> {
  entity: Entity<EntityRO>;
  item: EntityRO;
  customAction: EntityComponentActionConfig<EntityRO>;
  setItem: (item: EntityRO & {uniqueKey?: string}) => void;
  refreshItem: () => void;
  finishAction: () => void;
}

export interface IPropsEntityComponentActionMany<EntityRO> {
  entity: Entity<EntityRO>;
  items: EntityRO[];
  customAction: EntityComponentActionConfigMany<EntityRO>;
  refreshItems: () => void;
  finishAction: () => void;
}

import React from "react";
import {BaseEntity, FilterField, OrderDTO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData, IPropsEntityColumnFilter, IPropsEntityColumnInputType} from "./props";
import {MenuAction} from "./internal";

export interface EntityField {
  name: string;
  type: EntityColumnType;
  subtype?: string;
  titleKey: string;
  required?: boolean;
}

export interface EntityColumn extends EntityField {
  displayName?: string;
  filterName?: string;
  sortable?: boolean;
  filterable?: boolean;
  updatable?: boolean;
  updatableMany?: boolean;
  searchable?: boolean;
}

export interface EntityPredefinedValue {
  name: string;
  value: any;
}

export interface Entity<EntityRO> extends BaseEntity {
  name: string;
  api: {
    path: string;
    cacheName: string;
    defaultOrders: OrderDTO[];
    customFilterFields?: FilterField[];
  };
  actions: Map<EntityActionType, EntityActionConfig>;
  columns: EntityColumn[];
  nestedEntities: NestedEntity[];
  client: {
    titleKey: string;
    titleDetailsKey: string;
    icon: React.ComponentType;
    generateEmptyEntity: () => EntityRO;
    generateLabel: (item: EntityRO) => string;
    customActions?: EntityCustomActionConfig[];
  };
}

export interface EntityColumnTypeConfig {
  type: EntityColumnType;
  inputComponent: React.ComponentType<IPropsEntityColumnInputType>;
  filterComponent: React.ComponentType<IPropsEntityColumnFilter>;
  dataComponent: React.ComponentType<IPropsEntityColumnData<any>>;
  getDefaultValue: (column: EntityColumn) => any;
  parseValue: (column: EntityColumn, value: unknown, enumMap: {[key: string]: EnumInfoMap<any>}) => any;
  isSearchable: (column: EntityColumn, search: string, enumMap: {[key: string]: EnumInfoMap<any>}) => boolean;
  getSearchFilterField: (column: EntityColumn, search: string) => FilterField;
}

export interface NestedEntity {
  entityName: string;
  idColumnName: string;
  additionalColumns?: {name: string; value: any}[];
  hiddenColumns?: string[];
}

export interface EntityActionConfig {
  active: boolean;
  grant?: string;
}

export interface EntityCustomActionConfig {
  menuAction: MenuAction;
  api: {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    dataLocation: "URL" | "BODY";
  };
  fields: EntityField[];
  resultBehavior: EntityCustomActionResultBehavior;
  grant?: string;
}

export interface EnumInfo {
  labelKey: string;
}

export type EnumInfoMap<T> = Map<T, EnumInfo>;

export type EntityColumnType =
  | "Text"
  | "TextArea"
  | "Number"
  | "Date"
  | "Boolean"
  | "Enum"
  | "EnumList"
  | "Entity"
  | "EntityList";

export type EntityActionType = "CREATE" | "READ" | "UPDATE" | "DELETE";

export type EntityCustomActionResultBehavior = "None" | "UpdateEntityFromResult" | "RefreshEntity" | "LeaveEntity";

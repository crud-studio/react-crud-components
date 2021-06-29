import React from "react";
import {BaseEntity, FilterField, OrderDTO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData, IPropsEntityColumnFilter, IPropsEntityColumnInputType} from "./props";

export interface EntityColumn {
  name: string;
  displayName?: string;
  filterName?: string;
  type: EntityColumnType;
  subtype?: string;
  titleKey: string;
  sortable?: boolean;
  filterable?: boolean;
  updatable?: boolean;
  updatableMany?: boolean;
  searchable?: boolean;
  required?: boolean;
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
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  columns: EntityColumn[];
  nestedEntities: NestedEntity[];
  client: {
    titleKey: string;
    titleDetailsKey: string;
    icon: React.ComponentType;
    generateEmptyEntity: () => EntityRO;
    generateLabel: (item: EntityRO) => string;
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

export interface EnumInfo<T> {
  value: T;
  labelKey: string;
}

export type EnumInfoMap<T> = Map<T, EnumInfo<T>>;

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

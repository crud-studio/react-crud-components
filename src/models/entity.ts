import React, {ComponentType} from "react";
import {BaseEntity, FilterField, MediaFileAclMode, OrderDTO} from "@crud-studio/react-crud-core";
import {
  IPropsEntityColumnData,
  IPropsEntityColumnFilter,
  IPropsEntityColumnInputType,
  IPropsEntityComponentAction,
  IPropsEntityComponentActionMany,
  IPropsEntityComponentSummary,
  IPropsEntityCustomTab,
} from "./props";
import {MenuAction} from "./internal";
import {SvgIconProps} from "@mui/material";

export interface EntityField {
  name: string;
  type: EntityColumnType;
  subtype?: string;
  titleKey: string;
  required?: boolean;
  parameters?:
    | EntityFieldParametersText
    | EntityFieldParametersTextArea
    | EntityFieldParametersInteger
    | EntityFieldParametersDouble
    | EntityFieldParametersDate
    | EntityFieldParametersBoolean
    | EntityFieldParametersEnum
    | EntityFieldParametersEnumList
    | EntityFieldParametersEntity
    | EntityFieldParametersEntityList
    | EntityFieldParametersEmail
    | EntityFieldParametersFile;
}

export interface EntityFieldParametersText {}
export interface EntityFieldParametersTextArea {}
export interface EntityFieldParametersInteger {}
export interface EntityFieldParametersDouble {}
export interface EntityFieldParametersDate {}
export interface EntityFieldParametersBoolean {}
export interface EntityFieldParametersEnum {}
export interface EntityFieldParametersEnumList {}
export interface EntityFieldParametersEntity {}
export interface EntityFieldParametersEntityList {}
export interface EntityFieldParametersEmail {}
export interface EntityFieldParametersFile {
  acl: MediaFileAclMode;
  extensions?: string[];
  minSize?: number;
  maxSize?: number;
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
    icon: React.ComponentType<SvgIconProps>;
    showDetailsTab: boolean;
    generateEmptyEntity: () => EntityRO;
    generateLabel: (item: EntityRO) => string;
    customSummaries?: (EntityGenericSummaryConfig<EntityRO> | EntityComponentSummaryConfig<EntityRO>)[];
    customTabs?: EntityCustomTabConfig<EntityRO>[];
    customActions?: (EntityGenericActionConfig<EntityRO> | EntityComponentActionConfig<EntityRO>)[];
    customActionsMany?: (EntityGenericActionConfigMany<EntityRO> | EntityComponentActionConfigMany<EntityRO>)[];
  };
}

export interface EntityColumnTypeConfig {
  type: EntityColumnType;
  showComponentLabel: boolean;
  inputComponent: React.ComponentType<IPropsEntityColumnInputType>;
  filterComponent: React.ComponentType<IPropsEntityColumnFilter>;
  dataComponent: React.ComponentType<IPropsEntityColumnData<any>>;
  getDefaultValue: (column: EntityColumn) => any;
  parseValue: (column: EntityColumn, value: unknown, enumMap: {[key: string]: EnumInfoMap<any>}) => any;
  isSearchable: (column: EntityColumn, search: string, enumMap: {[key: string]: EnumInfoMap<any>}) => boolean;
  getSearchFilterField: (column: EntityColumn, search: string) => FilterField;
  getGrant: (column: EntityColumn, entityMap: {[key: string]: Entity<any>}) => string | undefined;
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

export interface EntitySummaryConfig<EntityRO> {
  id: string;
  grant?: string;
  isActive?: (item: EntityRO) => boolean;
}

export interface EntityGenericSummaryColumnConfig {
  name: string;
}

export interface EntityGenericSummaryConfig<EntityRO> extends EntitySummaryConfig<EntityRO> {
  columns: EntityGenericSummaryColumnConfig[];
}

export interface EntityComponentSummaryConfig<EntityRO> extends EntitySummaryConfig<EntityRO> {
  component: ComponentType<IPropsEntityComponentSummary<EntityRO>>;
}

export interface EntityCustomTabConfig<EntityRO> {
  id: string;
  labelKey: string;
  icon: React.ComponentType<SvgIconProps>;
  component: ComponentType<IPropsEntityCustomTab<EntityRO>>;
  grant?: string;
  isActive?: (item: EntityRO) => boolean;
}

export interface EntityCustomActionConfig<EntityRO> {
  menuAction: MenuAction;
  grant?: string;
  isActive?: (item: EntityRO) => boolean;
}

export interface EntityGenericActionApiConfig {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  dataLocation: "URL" | "BODY";
  clearCache?: boolean;
}

export interface EntityGenericActionConfig<EntityRO> extends EntityCustomActionConfig<EntityRO> {
  api: EntityGenericActionApiConfig;
  fields: EntityField[];
  resultBehavior: "None" | "UpdateEntityFromResult" | "RefreshEntity" | "LeaveEntity";
}

export interface EntityComponentActionConfig<EntityRO> extends EntityCustomActionConfig<EntityRO> {
  component: ComponentType<IPropsEntityComponentAction<EntityRO>>;
}

export interface EntityGenericActionConfigMany<EntityRO>
  extends Omit<EntityGenericActionConfig<EntityRO>, "isActive" | "resultBehavior"> {
  resultBehavior: "None" | "RefreshEntity";
}

export interface EntityComponentActionConfigMany<EntityRO>
  extends Omit<EntityCustomActionConfig<EntityRO>, "isActive"> {
  component: ComponentType<IPropsEntityComponentActionMany<EntityRO>>;
}

export interface EnumInfo {
  labelKey: string;
}

export type EnumInfoMap<T> = Map<T, EnumInfo>;

export type EntityColumnType =
  | "Text"
  | "TextArea"
  | "Integer"
  | "Double"
  | "Date"
  | "Boolean"
  | "Enum"
  | "EnumList"
  | "Entity"
  | "EntityList"
  | "Email"
  | "File";

export type EntityActionType = "CREATE" | "READ" | "UPDATE" | "DELETE";

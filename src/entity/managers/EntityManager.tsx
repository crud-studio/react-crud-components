import React, {FunctionComponent, PropsWithChildren, useCallback} from "react";
import {FilterField, UrlOptions} from "@crud-studio/react-crud-core";
import {Entity, EntityColumn, EnumInfo, EnumInfoMap} from "../../models/entity";
import {SelectOption} from "../../models/internal";
import {useIntl} from "react-intl";
import _ from "lodash";
import {entityColumnTypes} from "../column-types/entityColumnTypes";

interface IEntityContext {
  getEntity: (entityName?: string) => Entity<any>;
  getEntityEnum: (enumName?: string) => EnumInfoMap<any>;
  getEnumSelectOptions: (enumName?: string) => SelectOption[];
  getEnumValueSelectOption: (enumName: string, value: string) => SelectOption | null;
  getEnumValuesSelectOptions: (enumName: string, values: string[]) => SelectOption[];
  getEntityTableUrl: (entity: Entity<any>, options?: UrlOptions) => string;
  getEntityCreateUrl: (entity: Entity<any>, options?: UrlOptions) => string;
  getEntityDetailsUrl: (entity: Entity<any>, id?: number, options?: UrlOptions) => string;
  parseColumnValue: (column: EntityColumn, value: unknown) => any;
  isColumnValueValid: (column: EntityColumn, value: unknown, required?: boolean) => boolean;
  isColumnSearchable: (column: EntityColumn, search: string) => boolean;
  getColumnSearchFilterField: (column: EntityColumn, search: string) => FilterField;
}

export const EntityContext = React.createContext<IEntityContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  entityMap: {[key: string]: Entity<any>};
  enumMap: {[key: string]: EnumInfoMap<any>};
  getEntityTableUrl: (entity: Entity<any>, options?: UrlOptions) => string;
  getEntityCreateUrl: (entity: Entity<any>, options?: UrlOptions) => string;
  getEntityDetailsUrl: (entity: Entity<any>, id?: number, options?: UrlOptions) => string;
}

const EntityManager: FunctionComponent<IProps> = ({
  entityMap,
  enumMap,
  getEntityTableUrl,
  getEntityCreateUrl,
  getEntityDetailsUrl,
  children,
}) => {
  const intl = useIntl();

  const getEntity = useCallback(
    (entityName?: string): Entity<any> => {
      return entityMap[entityName || ""];
    },
    [entityMap]
  );

  const getEntityEnum = useCallback(
    (enumName?: string): EnumInfoMap<any> => {
      return enumMap[enumName || ""];
    },
    [entityMap]
  );

  const getEnumSelectOption = useCallback((value: string, enumInfo?: EnumInfo): SelectOption => {
    return {
      value: value,
      label: !!enumInfo?.labelKey ? intl.formatMessage({id: enumInfo.labelKey}) : value,
    };
  }, []);

  const getEnumSelectOptions = useCallback(
    (enumName?: string): SelectOption[] => {
      if (!enumName) {
        return [];
      }

      const enumInfoMap = enumMap[enumName];
      if (!enumInfoMap) {
        return [];
      }
      return Array.from(enumInfoMap).map(([value, enumInfo]) => getEnumSelectOption(value, enumInfo));
    },
    [enumMap]
  );

  const getEnumValueSelectOption = useCallback(
    (enumName: string, value: string): SelectOption | null => {
      const enumInfoMap = enumMap[enumName];
      if (!enumInfoMap) {
        return null;
      }
      const enumInfo = enumInfoMap.get(value);
      return enumInfo ? getEnumSelectOption(value, enumInfo) : null;
    },
    [enumMap]
  );

  const getEnumValuesSelectOptions = useCallback(
    (enumName: string, values: string[]): SelectOption[] => {
      const enumInfoMap = enumMap[enumName];
      if (!enumInfoMap) {
        return [];
      }
      return values.map((value) => getEnumSelectOption(value, enumInfoMap.get(value)));
    },
    [enumMap]
  );

  const parseColumnValue = useCallback(
    (column: EntityColumn, value: unknown): any => {
      if (_.isNil(value)) {
        return value;
      }
      return entityColumnTypes[column.type].parseValue(column, value, enumMap);
    },
    [enumMap]
  );

  const isColumnValueValid = useCallback(
    (column: EntityColumn, value: unknown, required: boolean = false): boolean => {
      return (!required && _.isNil(value)) || !_.isNil(parseColumnValue(column, value));
    },
    [parseColumnValue]
  );

  const isColumnSearchable = useCallback(
    (column: EntityColumn, search: string): boolean => {
      return !!search && !!column.searchable && entityColumnTypes[column.type].isSearchable(column, search, enumMap);
    },
    [enumMap]
  );

  const getColumnSearchFilterField = useCallback((column: EntityColumn, search: string): FilterField => {
    return entityColumnTypes[column.type].getSearchFilterField(column, search);
  }, []);

  return (
    <EntityContext.Provider
      value={{
        getEntity,
        getEntityEnum,
        getEnumSelectOptions,
        getEnumValueSelectOption,
        getEnumValuesSelectOptions,
        getEntityTableUrl,
        getEntityCreateUrl,
        getEntityDetailsUrl,
        parseColumnValue,
        isColumnValueValid,
        isColumnSearchable,
        getColumnSearchFilterField,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

export default EntityManager;

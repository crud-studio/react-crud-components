import React, {FunctionComponent, PropsWithChildren, useCallback} from "react";
import {UrlOptions} from "@crud-studio/react-crud-core";
import {Entity, EnumInfo, EnumInfoMap} from "../../models/entity";
import {SelectOption} from "../../models/internal";
import {notEmpty} from "../../helpers/ObjectUtils";
import {useIntl} from "react-intl";

interface IEntityContext {
  getEntity: (entityName?: string) => Entity<any>; // TODO: change from any?
  getEntityEnum: (enumName?: string) => EnumInfoMap<any>; // TODO: change from any?
  getEnumSelectOptions: (enumName?: string) => SelectOption[];
  getEnumValueSelectOption: (enumName: string, value: string) => SelectOption | null;
  getEnumValuesSelectOptions: (enumName: string, values: string[]) => SelectOption[];
  getEntityTableUrl: (entity: Entity<any>, options?: UrlOptions) => string;
  getEntityCreateUrl: (entity: Entity<any>, options?: UrlOptions) => string;
  getEntityDetailsUrl: (entity: Entity<any>, id?: number, options?: UrlOptions) => string;
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

  const getEnumSelectOption = useCallback((enumInfo: EnumInfo<any>): SelectOption => {
    return {
      value: enumInfo.value,
      label: intl.formatMessage({id: enumInfo.labelKey}),
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
      return Array.from(enumInfoMap).map(([, enumInfo]) => getEnumSelectOption(enumInfo));
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
      return enumInfo ? getEnumSelectOption(enumInfo) : null;
    },
    [enumMap]
  );

  const getEnumValuesSelectOptions = useCallback(
    (enumName: string, values: string[]): SelectOption[] => {
      const enumInfoMap = enumMap[enumName];
      if (!enumInfoMap) {
        return [];
      }
      return values
        .map((value) => enumInfoMap.get(value))
        .filter(notEmpty)
        .map((enumInfo) => getEnumSelectOption(enumInfo));
    },
    [enumMap]
  );

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
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

export default EntityManager;

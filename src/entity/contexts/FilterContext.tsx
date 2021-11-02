import React, {FunctionComponent, PropsWithChildren, useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {URL_PARAM_FILTERS, urlValuesSeparator} from "../../constants/urlKeys";
import {FilterField, useDebounceFn, useUrlState} from "@crud-studio/react-crud-core";
import {Entity} from "../../models/entity";
import EntityUtils from "../helpers/EntityUtils";

interface IFiltersContext {
  contextFilterFields: FilterField[];
  contextFilterFieldsClearedFlag: number;
  updateContextFilterField: (filterField: FilterField, debounced: boolean) => void;
  removeContextFilterField: (filterFieldName: string, debounced: boolean) => void;
  clearContextFilterFields: () => void;
}

const FiltersContext = React.createContext<IFiltersContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  entity: Entity<any>;
  onContextFilterFieldsUpdated?: (customFilterFields: FilterField[]) => void;
}

const FilterProvider: FunctionComponent<IProps> = ({entity, onContextFilterFieldsUpdated, children}) => {
  const [contextFilterFields, setContextFilterFields] = useUrlState<FilterField[]>(
    URL_PARAM_FILTERS,
    [],
    (state) => !!state.length,
    (urlState) => {
      return urlState
        .split(urlValuesSeparator)
        .map<FilterField>((stringFilterField) => {
          try {
            return JSON.parse(stringFilterField);
          } catch (e) {
            return {};
          }
        })
        .filter(
          (filterField) =>
            !!filterField.operation &&
            !!filterField.values?.length &&
            entity.columns.some((column) => EntityUtils.getColumnFilterFieldName(column) === filterField.fieldName)
        );
    },
    (state) => {
      return state.map<string>((filterField) => JSON.stringify(filterField)).join(urlValuesSeparator);
    }
  );

  const [contextFilterFieldsClearedFlag, setContextFilterFieldsClearedFlag] = useState<number>(0);
  const [contextFilterFieldsUpdated, setContextFilterFieldsUpdated] = useState<number>(0);
  const setContextFilterFieldsUpdatedDebounced = useDebounceFn(setContextFilterFieldsUpdated, 500);

  const dispatchContextFilterFieldsUpdated = useCallback(
    (debounced: boolean): void => {
      const now = new Date().getTime();
      if (debounced) {
        setContextFilterFieldsUpdatedDebounced(now);
      } else {
        setContextFilterFieldsUpdated(now);
        setContextFilterFieldsUpdatedDebounced(now);
      }
    },
    [setContextFilterFieldsUpdated, setContextFilterFieldsUpdatedDebounced]
  );

  useEffect(() => {
    if (onContextFilterFieldsUpdated) {
      onContextFilterFieldsUpdated(contextFilterFields);
    }
  }, [contextFilterFieldsUpdated]);

  const updateContextFilterField = useCallback(
    (filterField: FilterField, debounced: boolean): void => {
      setContextFilterFields((contextFilterFields) => [
        ...contextFilterFields.filter((x) => x.fieldName !== filterField.fieldName),
        filterField,
      ]);
      dispatchContextFilterFieldsUpdated(debounced);
    },
    [setContextFilterFields, dispatchContextFilterFieldsUpdated]
  );

  const removeContextFilterField = useCallback(
    (filterFieldName: string, debounced: boolean): void => {
      setContextFilterFields((contextFilterFields) =>
        contextFilterFields.filter((x) => x.fieldName !== filterFieldName)
      );
      dispatchContextFilterFieldsUpdated(debounced);
    },
    [setContextFilterFields]
  );

  const clearContextFilterFields = useCallback((): void => {
    if (!_.isEmpty(contextFilterFields)) {
      setContextFilterFields([]);
      setContextFilterFieldsClearedFlag((flag) => flag + 1);
      dispatchContextFilterFieldsUpdated(false);
    }
  }, [contextFilterFields, setContextFilterFields]);

  return (
    <FiltersContext.Provider
      value={{
        contextFilterFields,
        contextFilterFieldsClearedFlag,
        updateContextFilterField,
        removeContextFilterField,
        clearContextFilterFields,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export {IFiltersContext, FiltersContext, FilterProvider};

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import _ from "lodash";
import {useUpdateEffect} from "react-use";
import {AbstractJpaRO, FilterField, useDebounceFn} from "@crud-studio/react-crud-core";
import {useCrudSearch} from "@crud-studio/react-crud-core";
import {Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, TextField} from "@material-ui/core";
import {AutocompleteInputChangeReason} from "@material-ui/core/useAutocomplete/useAutocomplete";
import {IPropsEntitySelect} from "../../models/props";
import useSearchFilterFields from "../hooks/useSearchFilterFields";
import {useIntl} from "react-intl";

const AsyncCreatableEntitySelect = <EntityRO extends AbstractJpaRO>({
  id,
  entity,
  orders,
  filterFields,
  valueKey,
  labelKey,
  labelFn,
  optionDataFn,
  placeholderKey,
  initialValue,
  initialValueIds,
  onChange,
  onEntityChange,
  clearFlag,
  multiple = false,
  maxValues = 0,
  cache = true,
  lazy = false,
  innerRef,
  fieldLabel,
  fieldRequired,
  fieldEndAdornment,
  ...rest
}: IPropsEntitySelect<EntityRO>) => {
  const intl = useIntl();

  const [search, setSearch] = useState<string>("");
  const setSearchDebounced = useDebounceFn(setSearch, 250);

  const loadOptionsSearch = useRef<string>("");
  const inputChangeSearch = useRef<string>("");

  const searchFilterFields = useSearchFilterFields(entity, search);
  const [aggregatedFilterFields, setAggregatedFilterFields] = useState<FilterField[]>([]);
  const [manual, setManual] = useState<boolean>(true);

  useEffect(() => {
    const listFilterFields = filterFields || [];
    setAggregatedFilterFields([...listFilterFields, ...searchFilterFields]);

    if (!lazy) {
      setManual(false);
    }
  }, [searchFilterFields, filterFields]);

  const onMenuOpen = useCallback((): void => {
    setManual(false);
  }, [setManual]);

  const [allItems, setAllItems] = useState<EntityRO[]>([]);
  const optionsSearchState = useCrudSearch<EntityRO>(
    entity,
    1,
    50,
    aggregatedFilterFields,
    orders || entity.api.defaultOrders,
    {
      manual: manual,
      count: false,
      cache: cache,
      throttle: true,
      cacheAutoReload: true,
    }
  );

  useUpdateEffect(() => {
    if (optionsSearchState.result && _.isEqual(inputChangeSearch.current, loadOptionsSearch.current)) {
      setAllItems(optionsSearchState.result);
    } else {
      setSearch(inputChangeSearch.current);
    }
  }, [optionsSearchState.result]);

  const onInputChange = (
    event: React.SyntheticEvent,
    inputValue: string,
    reason: AutocompleteInputChangeReason
  ): void => {
    if (reason === "reset") {
      return;
    }

    inputChangeSearch.current = inputValue;
    if (!optionsSearchState.loading) {
      loadOptionsSearch.current = inputValue;
      setSearchDebounced(inputValue);
    }
  };

  const getOptionLabel = useCallback(
    (item: EntityRO): string => {
      if (labelFn) {
        return labelFn(item);
      }
      if (labelKey) {
        return _.toString(_.get(item, labelKey));
      }
      return entity.client.generateLabel(item);
    },
    [labelFn, labelKey]
  );

  const getEmptyValue = (): EntityRO[] | null => {
    return multiple ? [] : null;
  };

  const [value, setValue] = useState<EntityRO | EntityRO[] | null>(initialValue || getEmptyValue());

  useUpdateEffect(() => {
    setValue(initialValue || getEmptyValue());
  }, [initialValue]);

  useUpdateEffect(() => {
    if (clearFlag) {
      setValue(getEmptyValue());
    }
  }, [clearFlag]);

  const getInitialValueIdsInternal = (initialValueIds?: number | number[]): number[] => {
    if (!initialValueIds) {
      return [];
    }

    if (_.isArray(initialValueIds)) {
      return initialValueIds;
    }

    return [initialValueIds];
  };

  const [initialValueIdsInternal, setInitialValueIdsInternal] = useState<number[]>(
    getInitialValueIdsInternal(initialValueIds)
  );

  const initialValueSearchState = useCrudSearch<EntityRO>(
    entity,
    1,
    1000,
    [{fieldName: "id", operation: "In", values: initialValueIdsInternal}],
    [{by: "id", descending: false}],
    {
      manual: true,
      count: false,
      cache: cache,
      throttle: true,
      cacheAutoReload: false,
    }
  );

  const isIdInValue = useCallback(
    (id: number): boolean => {
      if (!value) {
        return false;
      }

      if (_.isArray(value)) {
        return !!_.find(value, (entity) => entity.id === id);
      }

      return value.id === id;
    },
    [value]
  );

  useEffect(() => {
    if (!_.isEmpty(initialValueIdsInternal)) {
      if (_.every(initialValueIdsInternal, (id) => isIdInValue(id))) {
        return;
      }
      if (initialValueSearchState.loading) {
        initialValueSearchState.cancelRequest();
      }
      initialValueSearchState.executeRequest();
    }
  }, [initialValueIdsInternal]);

  useUpdateEffect(() => {
    const newInitialValueIdsInternal = getInitialValueIdsInternal(initialValueIds);
    if (!_.isEqual(initialValueIdsInternal, newInitialValueIdsInternal)) {
      setInitialValueIdsInternal(newInitialValueIdsInternal);
    }
  }, [initialValueIds]);

  useUpdateEffect(() => {
    if (initialValueSearchState.result && !_.isEmpty(initialValueSearchState.result)) {
      if (multiple) {
        setValue(initialValueSearchState.result);
      } else {
        setValue(initialValueSearchState.result[0]);
      }
    }
  }, [initialValueSearchState.result]);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: EntityRO | EntityRO[] | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<EntityRO>
  ) => {
    if (onChange) {
      onChange(event, newValue, reason, details);
    }

    setValue(newValue || getEmptyValue());

    if (onEntityChange) {
      onEntityChange(newValue);
    }
  };

  const isMaxValuesSelected = (): boolean => {
    return !!maxValues && _.isArray(value) && value.length >= maxValues;
  };

  const getNoOptionsMessage = (): string => {
    if (isMaxValuesSelected()) {
      return intl.formatMessage({id: "pages.maximum-values-reached"});
    }
    return intl.formatMessage({id: "pages.no-results-found"});
  };

  const getOptions = (): EntityRO[] => {
    if (!isMaxValuesSelected()) {
      if (!value) {
        return allItems;
      }
      // If there is value then it must be part of the options
      return _.unionBy(allItems, _.isArray(value) ? value : [value], (option) => option.id);
    }
    if (!value) {
      return [];
    }
    if (_.isArray(value)) {
      return value;
    }
    return [value];
  };

  const loading = useMemo<boolean>(
    () => optionsSearchState.loading || initialValueSearchState.loading,
    [optionsSearchState.loading, initialValueSearchState.loading]
  );

  return (
    <Autocomplete
      {...rest}
      id={id}
      options={getOptions()}
      loading={loading}
      multiple={multiple}
      value={value}
      getOptionLabel={getOptionLabel}
      loadingText={intl.formatMessage({id: "pages.loading"})}
      noOptionsText={getNoOptionsMessage()}
      disableClearable={rest.disableClearable || rest.disabled}
      filterOptions={(x) => x}
      ref={innerRef || rest.ref}
      freeSolo={false}
      onInputChange={onInputChange}
      onChange={handleChange}
      onOpen={onMenuOpen}
      isOptionEqualToValue={(option: EntityRO, value: EntityRO) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={rest.placeholder || intl.formatMessage({id: placeholderKey || "pages.search"})}
          variant="outlined"
          label={fieldLabel}
          required={fieldRequired}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {fieldEndAdornment}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
export default AsyncCreatableEntitySelect;

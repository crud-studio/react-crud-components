import React, {FunctionComponent, useCallback, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {FormattedMessage, useIntl} from "react-intl";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import _ from "lodash";
import {IconButton, InputAdornment} from "@mui/material";
import {OpenInNewOutlined} from "@mui/icons-material";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import AsyncCreatableEntitySelect from "../../../inputs/AsyncCreatableEntitySelect";
import {Entity} from "../../../../models/entity";
import useEntity from "../../../contexts/entity/hooks/useEntity";
import {useSnackbar} from "notistack";

const EntityFieldInputEntityList: FunctionComponent<IPropsEntityColumnInputType> = ({
  entityField,
  name,
  disabled,
  defaultValue,
  onValueChanged,
}) => {
  const intl = useIntl();
  const methods = useFormContext();
  const {enqueueSnackbar} = useSnackbar();
  const {getEntity, getEntityDetailsUrl} = useEntity();

  const [entity] = useState<Entity<any>>(getEntity(entityField.subtype));
  const [value, setValue] = useState<number[]>(defaultValue);

  const getValueIds = useCallback((value: AbstractJpaRO | AbstractJpaRO[] | null): number[] => {
    if (!value) {
      return [];
    }
    if (_.isArray(value)) {
      if (_.isEmpty(value)) {
        return [];
      }
      return value.map((v) => v.id);
    }
    return [value.id];
  }, []);

  const onValueChangedInternal = useCallback(
    (value: number[]): void => {
      setValue(value);
      onValueChanged(value);
    },
    [setValue, onValueChanged]
  );

  const openEntityNewTab = useCallback((): void => {
    if (value && !_.isEmpty(value)) {
      value.forEach((id) => window.open(getEntityDetailsUrl(entity, id)));
    } else {
      enqueueSnackbar(<FormattedMessage id="pages.no-item-is-selected" />, {variant: "warning"});
    }
  }, [value, entity]);

  return (
    <Controller
      name={name}
      rules={{required: entityField.required ? intl.formatMessage({id: "pages.required-field"}) : false}}
      control={methods.control}
      defaultValue={defaultValue || null}
      render={({field}) => {
        return (
          <AsyncCreatableEntitySelect
            entity={entity}
            initialValueIds={defaultValue}
            cache={true}
            lazy={true}
            onChange={(e, value, reason, details) => {
              const valueIds = getValueIds(value);
              field?.onChange(valueIds);
              onValueChangedInternal(valueIds);
            }}
            placeholderKey={"pages.select"}
            multiple={true}
            fullWidth
            isOptionEqualToValue={(option, value) => option.id === value.id}
            innerRef={field?.ref}
            disabled={disabled}
            disableClearable={disabled || entityField.required}
            fieldLabel={<FormattedMessage id={entityField.titleKey} defaultMessage={entityField.titleKey} />}
            fieldRequired={entityField.required}
            fieldEndAdornment={
              value && !_.isEmpty(value) ? (
                <InputAdornment position="end">
                  <IconButton color="inherit" size="small" onClick={openEntityNewTab}>
                    <OpenInNewOutlined fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined
            }
            sx={{flexGrow: 1}}
          />
        );
      }}
    />
  );
};
export default EntityFieldInputEntityList;

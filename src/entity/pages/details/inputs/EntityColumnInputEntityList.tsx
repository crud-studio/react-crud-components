import React, {FunctionComponent, useCallback, useContext, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {FormattedMessage, useIntl} from "react-intl";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import _ from "lodash";
import {Box, IconButton} from "@material-ui/core";
import {OpenInNewOutlined} from "@material-ui/icons";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import AsyncCreatableEntitySelect from "../../../inputs/AsyncCreatableEntitySelect";
import {Entity} from "../../../../models/entity";
import {EntityContext} from "../../../managers/EntityManager";
import NotificationManager from "../../../../components/notifications/NotificationManager";

const EntityColumnInputEntityList: FunctionComponent<IPropsEntityColumnInputType> = ({
  column,
  name,
  disabled,
  defaultValue,
  onValueChanged,
}) => {
  const intl = useIntl();
  const methods = useFormContext();
  const {getEntity, getEntityDetailsUrl} = useContext(EntityContext);

  const [entity] = useState<Entity<any>>(getEntity(column.subtype));
  const [value, setValue] = useState<number[]>(defaultValue);

  const getValueIds = useCallback((value: BaseJpaRO | BaseJpaRO[] | null): number[] => {
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
      NotificationManager.warning(<FormattedMessage id="pages.no-item-is-selected" />);
    }
  }, [value, entity]);

  return (
    <Box sx={{display: "flex", flexDirection: "row"}}>
      <Controller
        name={name}
        rules={{required: column.required ? intl.formatMessage({id: "pages.required-field"}) : false}}
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
              size="small"
              multiple={true}
              fullWidth
              isOptionEqualToValue={(option, value) => option.id === value.id}
              innerRef={field?.ref}
              disabled={disabled}
              disableClearable={disabled || column.required}
              sx={{flexGrow: 1}}
            />
          );
        }}
      />
      <IconButton color="primary" size="small" onClick={openEntityNewTab}>
        <OpenInNewOutlined />
      </IconButton>
    </Box>
  );
};
export default EntityColumnInputEntityList;

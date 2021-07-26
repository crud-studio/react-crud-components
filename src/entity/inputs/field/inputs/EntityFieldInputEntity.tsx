import React, {FunctionComponent, useCallback, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {FormattedMessage, useIntl} from "react-intl";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import _ from "lodash";
import {Box, IconButton} from "@material-ui/core";
import {OpenInNewOutlined} from "@material-ui/icons";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import AsyncCreatableEntitySelect from "../../../inputs/AsyncCreatableEntitySelect";
import {Entity} from "../../../../models/entity";
import NotificationManager from "../../../../components/notifications/NotificationManager";
import useEntity from "../../../hooks/useEntity";

const EntityFieldInputEntity: FunctionComponent<IPropsEntityColumnInputType> = ({
  entityField,
  name,
  disabled,
  defaultValue,
  onValueChanged,
}) => {
  const intl = useIntl();
  const methods = useFormContext();
  const {getEntity, getEntityDetailsUrl} = useEntity();

  const [entity] = useState<Entity<any>>(getEntity(entityField.subtype));
  const [value, setValue] = useState<number>(defaultValue);

  const getValueId = useCallback((value: BaseJpaRO | BaseJpaRO[] | null): number => {
    if (!value) {
      return 0;
    }
    if (_.isArray(value)) {
      if (_.isEmpty(value)) {
        return 0;
      }
      return value[0].id;
    }
    return value.id;
  }, []);

  const onValueChangedInternal = useCallback(
    (value: number): void => {
      setValue(value);
      onValueChanged(value);
    },
    [setValue, onValueChanged]
  );

  const openEntityNewTab = useCallback((): void => {
    if (value) {
      window.open(getEntityDetailsUrl(entity, value));
    } else {
      NotificationManager.warning(<FormattedMessage id="pages.no-item-is-selected" />);
    }
  }, [value, entity]);

  return (
    <Box sx={{display: "flex", flexDirection: "row"}}>
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
                const valueId = getValueId(value);
                field?.onChange(valueId);
                onValueChangedInternal(valueId);
              }}
              placeholderKey={"pages.select"}
              multiple={false}
              fullWidth
              isOptionEqualToValue={(option, value) => option.id === value.id}
              innerRef={field?.ref}
              disabled={disabled}
              disableClearable={disabled || entityField.required}
              fieldLabel={<FormattedMessage id={entityField.titleKey} />}
              fieldRequired={entityField.required}
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
export default EntityFieldInputEntity;

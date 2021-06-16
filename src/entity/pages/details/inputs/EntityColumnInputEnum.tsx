import React, {FunctionComponent, useContext, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import _ from "lodash";
import {Autocomplete, TextField} from "@material-ui/core";
import {useIntl} from "react-intl";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import {SelectOption} from "../../../../models/internal";
import {EntityContext} from "../../../managers/EntityManager";

const EntityColumnInputEnum: FunctionComponent<IPropsEntityColumnInputType> = ({
  column,
  name,
  disabled,
  defaultValue,
  onValueChanged,
}) => {
  const intl = useIntl();
  const methods = useFormContext();
  const {getEnumSelectOptions, getEnumValueSelectOption} = useContext(EntityContext);

  const [options] = useState<SelectOption[]>(getEnumSelectOptions(column.subtype));

  return (
    <Controller
      name={name}
      rules={{required: column.required ? intl.formatMessage({id: "pages.required-field"}) : false}}
      control={methods.control}
      defaultValue={_.isNil(defaultValue) || !column.subtype ? null : defaultValue}
      render={({field}: any) => {
        return (
          <Autocomplete
            options={options}
            getOptionLabel={(option: SelectOption) => option?.label}
            renderInput={(params) => (
              <TextField {...params} placeholder={intl.formatMessage({id: "pages.select"})} variant="outlined" />
            )}
            onChange={(e, value, reason, details) => {
              const enumValue = value?.value;
              field?.onChange(enumValue);
              onValueChanged(enumValue);
            }}
            defaultValue={
              _.isNil(defaultValue) || !column.subtype ? null : getEnumValueSelectOption(column.subtype, defaultValue)
            }
            size="small"
            multiple={false}
            freeSolo={false}
            fullWidth
            isOptionEqualToValue={(option, value) => option.value === value.value}
            ref={field?.ref}
            disabled={disabled}
            disableClearable={disabled || column.required}
          />
        );
      }}
    />
  );
};
export default EntityColumnInputEnum;

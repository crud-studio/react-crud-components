import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {EntityColumnTypeConfig, EntityField} from "../../../models/entity";
import {entityColumnTypes} from "../../column-types/entityColumnTypes";

interface IProps {
  entityField: EntityField;
  name?: string;
  disabled?: boolean;
  defaultValue?: any;
  onValueChanged?: (value: any) => void;
}

const EntityFieldInput: FunctionComponent<IProps> = ({
  entityField,
  name,
  disabled = false,
  defaultValue,
  onValueChanged,
}) => {
  const [inputConfig] = useState<EntityColumnTypeConfig>(entityColumnTypes[entityField.type]);
  const [inputValueChanged, setInputValueChanged] = useState<number>(0);
  const methods = useFormContext();

  useEffect(() => {
    if (!methods) {
      return;
    }

    if (inputValueChanged) {
      // let inputValueRaw = methods.getValues(getInputName());
      // let inputValue = _.isObject(inputValueRaw) ? JSON.stringify(inputValueRaw) : inputValueRaw;
      const inputValue = methods.getValues(getInputName());
      if (onValueChanged) {
        onValueChanged(inputValue);
      }
    }
  }, [inputValueChanged]);

  const getInputName = useCallback((): string => {
    return name || entityField.name;
  }, [name, entityField]);

  const onInputValueChanged = useCallback((): void => {
    setInputValueChanged((inputValueChanged) => inputValueChanged + 1);
  }, [setInputValueChanged]);

  return (
    <inputConfig.inputComponent
      entityField={entityField}
      name={getInputName()}
      disabled={disabled}
      defaultValue={defaultValue}
      onValueChanged={onInputValueChanged}
    />
  );
};
export default EntityFieldInput;

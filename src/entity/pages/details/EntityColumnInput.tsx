import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import _ from "lodash";
import {EntityColumn, EntityColumnTypeConfig} from "../../../models/entity";
import {entityColumnTypes} from "../../column-types/entityColumnTypes";

interface IProps {
  column: EntityColumn;
  name?: string;
  disabled?: boolean;
  defaultValue?: any;
  onValueChanged?: (value: any) => void;
}

const EntityColumnInput: FunctionComponent<IProps> = ({
  column,
  name,
  disabled = false,
  defaultValue,
  onValueChanged,
}) => {
  const [inputConfig] = useState<EntityColumnTypeConfig>(entityColumnTypes[column.type]);
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
    return name || column.name;
  }, [name, column]);

  const onInputValueChanged = useCallback((): void => {
    setInputValueChanged((inputValueChanged) => inputValueChanged + 1);
  }, [setInputValueChanged]);

  return (
    <inputConfig.inputComponent
      column={column}
      name={getInputName()}
      disabled={disabled}
      defaultValue={defaultValue}
      onValueChanged={onInputValueChanged}
    />
  );
};
export default EntityColumnInput;

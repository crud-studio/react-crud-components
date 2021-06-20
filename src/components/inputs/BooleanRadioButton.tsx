import React, {FunctionComponent, Ref, useState} from "react";
import {useUpdateEffect} from "react-use";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {FormattedMessage} from "react-intl";

interface IProps {
  value?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  innerRef?: Ref<any>;
  group: string;
}

const BooleanRadioButton: FunctionComponent<IProps> = ({value: defaultValue, onChange, disabled, innerRef, group}) => {
  const [value, setValue] = useState<string | null>(defaultValue || null);

  const onChangeInternal = (newValue: string) => {
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  useUpdateEffect(() => {
    if (!defaultValue) {
      setValue(null);
    }
  }, [defaultValue]);

  return (
    <RadioGroup
      defaultValue={defaultValue}
      value={value}
      name={group}
      row
      onChange={(event, value) => onChangeInternal(value)}
      ref={innerRef}
    >
      <FormControlLabel
        value="true"
        control={<Radio />}
        label={<FormattedMessage id="pages.yes" />}
        disabled={disabled}
      />
      <FormControlLabel
        value="false"
        control={<Radio />}
        label={<FormattedMessage id="pages.no" />}
        disabled={disabled}
      />
    </RadioGroup>
  );
};

export default BooleanRadioButton;

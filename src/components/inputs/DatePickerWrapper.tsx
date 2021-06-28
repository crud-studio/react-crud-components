import React, {FunctionComponent, Ref, useCallback, useState} from "react";
import {useUpdateEffect} from "react-use";
import {TextField} from "@material-ui/core";
import {DatePicker} from "@material-ui/lab";
import {useIntl} from "react-intl";

interface IProps {
  value?: number;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  innerRef?: Ref<any>;
}

const DatePickerWrapper: FunctionComponent<IProps> = ({
  value: defaultValue,
  onChange,
  disabled,
  placeholder,
  innerRef,
}) => {
  const intl = useIntl();

  const getDateValue = useCallback((value?: number): Date | null => {
    if (value) {
      return new Date(value);
    }
    return null;
  }, []);

  const [selected, setSelected] = useState<Date | null>(getDateValue(defaultValue));

  useUpdateEffect(() => {
    if (!defaultValue) {
      setSelected(null);
    }
  }, [defaultValue]);

  const onChangeInternal = (selected: Date | null): void => {
    setSelected(selected);

    if (onChange) {
      onChange(selected ? selected.getTime() : null);
    }
  };

  return (
    <DatePicker
      onChange={onChangeInternal}
      value={selected}
      allowSameDateSelection
      mask={undefined}
      clearable={!disabled}
      disabled={disabled}
      disableOpenPicker={disabled}
      renderInput={({inputProps, ...params}) => {
        delete inputProps?.placeholder;
        // delete inputProps?.readOnly;
        return (
          <TextField
            {...params}
            label=""
            helperText=""
            placeholder={placeholder || intl.formatMessage({id: "pages.select"})}
            inputProps={inputProps}
            size="small"
            fullWidth
            disabled={disabled}
            ref={innerRef}
            // InputProps={{
            //   ...params.InputProps,
            //   readOnly: true,
            //   endAdornment:
            //     !!selected && !disabled ? (
            //       <InputAdornment position="end">
            //         <IconButton aria-label="clear filter" size="small" onClick={() => onChangeInternal(null)}>
            //           <Clear fontSize="small" />
            //         </IconButton>
            //       </InputAdornment>
            //     ) : undefined,
            // }}
          />
        );
      }}
    />
  );
};
export default React.memo(DatePickerWrapper);

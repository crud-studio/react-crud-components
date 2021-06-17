import React, {FunctionComponent, useContext, useState} from "react";
import {useEffectOnce, useUpdateEffect} from "react-use";
import {FiltersContext} from "../../../managers/FilterManager";
import _ from "lodash";
import {DateRangePicker} from "@material-ui/lab";
import {IconButton, InputAdornment, TextField} from "@material-ui/core";
import {DateRange} from "@material-ui/lab/DateRangePicker/RangeTypes";
import {Clear} from "@material-ui/icons";
import {IPropsEntityColumnFilter} from "../../../../models/props";
import {useIntl} from "react-intl";

const TableFilterDate: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
    const intl = useIntl();

    const {contextFilterFields, contextFilterFieldsClearedFlag, updateContextFilterField, removeContextFilterField} =
        useContext(FiltersContext);

    const [value, setValue] = useState<DateRange<Date>>([null, null]);

    useEffectOnce(() => {
        if (!!contextFilterFields?.length) {
            const filterField = _.find(contextFilterFields, {fieldName: column.name});
            if (filterField?.values && filterField?.values.length === 2) {
                setValue([new Date(_.parseInt(filterField.values[0])), new Date(_.parseInt(filterField.values[1]))]);
            }
        }
    });

    useUpdateEffect(() => {
        if (!!value[0] || !!value[1]) {
            setValue([null, null]);
        }
    }, [contextFilterFieldsClearedFlag]);

    const onFilterChange = (filterValue: DateRange<Date>): void => {
        setValue(filterValue);
        if (!!filterValue[0] === !!filterValue[1]) {
            onFilterValueChange(filterValue, true);
        }
    };

    const onFilterValueChange = (filterValue: DateRange<Date>, debounced: boolean): void => {
        if (!!filterValue[0] && !!filterValue[1]) {
            updateContextFilterField(
                {
                    fieldName: column.name,
                    operation: "Between",
                    values: [filterValue[0]?.getTime(), filterValue[1]?.getTime() + 86_400_000],
                },
                debounced
            );
        } else {
            removeContextFilterField(column.name, debounced);
        }
    };

    const [closeFlag, setCloseFlag] = useState<number>(0);

    const onClose = (): void => {
        setCloseFlag((closeFlag) => closeFlag + 1);
    };

    useUpdateEffect(() => {
        if (!!value[0] && !value[1]) {
            setValue([null, null]);
        }
    }, [closeFlag]);

    return (
        <DateRangePicker
            onChange={onFilterChange}
            onClose={onClose}
            value={value}
            disableMaskedInput
            renderInput={({inputProps, ...startProps}, endProps) => {
                const startValue = inputProps?.value;
                const endValue = endProps.inputProps?.value;
                delete inputProps?.value;
                delete inputProps?.placeholder;
                return (
                    <TextField
                        {...startProps}
                        label=""
                        helperText=""
                        placeholder={intl.formatMessage({id: "pages.search"})}
                        inputProps={inputProps}
                        value={!!startValue && !!endValue ? `${startValue} - ${endProps.inputProps?.value}` : ""}
                        size="small"
                        InputProps={{
                            readOnly: true,
                            endAdornment:
                                !!value[0] && !!value[1] ? (
                                    <InputAdornment position="end">
                                        <IconButton aria-label="clear filter" size="small"
                                                    onClick={() => onFilterChange([null, null])}>
                                            <Clear fontSize="small"/>
                                        </IconButton>
                                    </InputAdornment>
                                ) : undefined,
                        }}
                    />
                );
            }}
        />
    );
};
export default TableFilterDate;

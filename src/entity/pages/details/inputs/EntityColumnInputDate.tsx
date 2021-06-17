import React, {FunctionComponent} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import DatePickerWrapper from "../../../../components/inputs/DatePickerWrapper";
import {useIntl} from "react-intl";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import {LocalizationProvider} from "@material-ui/lab";

const EntityColumnInputDate: FunctionComponent<IPropsEntityColumnInputType> = ({
                                                                                   column,
                                                                                   name,
                                                                                   disabled,
                                                                                   defaultValue,
                                                                                   onValueChanged,
                                                                               }) => {
    const intl = useIntl();
    const methods = useFormContext();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={intl.locale}>
            <Controller
                name={name}
                control={methods?.control}
                rules={{required: column.required ? intl.formatMessage({id: "pages.required-field"}) : false}}
                defaultValue={defaultValue || null}
                render={({field}: any) => {
                    return (
                        <DatePickerWrapper
                            onChange={(value) => {
                                field?.onChange(value);
                                onValueChanged(value);
                            }}
                            value={field?.value}
                            disabled={disabled}
                            innerRef={field?.ref}
                        />
                    );
                }}
            />
        </LocalizationProvider>
    );
};
export default EntityColumnInputDate;

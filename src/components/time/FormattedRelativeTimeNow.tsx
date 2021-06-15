import React, {FunctionComponent, useState} from "react";
import {FormattedRelativeTime} from "react-intl";
import {useUpdateEffect} from "react-use";
import {Props} from "react-intl/src/components/relative";

interface IProps extends Props {
  value: number;
}

const FormattedRelativeTimeNow: FunctionComponent<IProps> = ({value, ...rest}) => {
  const calculateValue = (time: number): number => {
    const now = new Date().getTime();
    return (time - now) / 1000;
  };

  const [calculatedValue, setCalculatedValue] = useState<number>(calculateValue(value));

  useUpdateEffect(() => {
    setCalculatedValue(calculateValue(value));
  }, [value]);

  return <FormattedRelativeTime value={calculatedValue} numeric="auto" updateIntervalInSeconds={1} {...rest} />;
};
export default FormattedRelativeTimeNow;

import React, {FunctionComponent} from "react";
import {FormattedDate, FormattedTime} from "react-intl";
import FormattedRelativeTimeNow from "./FormattedRelativeTimeNow";

interface IProps {
  time: number;
}

const FullTime: FunctionComponent<IProps> = ({time}) => {
  return (
    <>
      <FormattedDate value={time} /> <FormattedTime value={time} />
      {" ("}
      <FormattedRelativeTimeNow value={time} />
      {")"}
    </>
  );
};
export default FullTime;

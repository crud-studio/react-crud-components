import React, {FunctionComponent, PropsWithChildren} from "react";
import {NavLink} from "react-router-dom";

interface IProps extends PropsWithChildren<any> {
  to: string;
  condition: boolean;
}

const ConditionalLink: FunctionComponent<IProps> = ({to, condition, children}) => {
  return condition && to ? <NavLink to={to}>{children}</NavLink> : <>{children}</>;
};
export default ConditionalLink;

import {ComponentType, ReactNode} from "react";
import {SvgIconProps} from "@mui/material";
import * as React from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface MenuAction {
  id: string;
  labelKey: string;
  descriptionKey?: string;
  icon: ComponentType<SvgIconProps>;
  keyBinding?: string;
  visible?: boolean;
  dividerTop?: boolean;
  dividerBottom?: boolean;
}

export interface TabInfo {
  id: string;
  labelKey: string;
  icon?: React.ReactElement;
  lazy?: boolean;
  className?: string;
}

export interface NotificationInfo {
  uuid?: string;
  type: NotificationType;
  message: string | ReactNode;
  action?: ReactNode;
  timeOut?: number;
}

export type ButtonSize = "small" | "medium" | "large";

export type NotificationType = "info" | "success" | "warning" | "error";

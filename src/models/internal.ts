import {ComponentType} from "react";

export interface MenuAction {
    id: string;
    labelKey: string;
    icon: ComponentType;
    keyBinding?: string;
    visible?: boolean;
    dividerTop?: boolean;
    dividerBottom?: boolean;
}

export interface TabInfo {
    id: string;
    labelKey: string;
    lazy?: boolean;
    className?: string;
}

export type ButtonSize = "small" | "medium" | "large";

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

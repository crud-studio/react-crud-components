import React, {FunctionComponent} from "react";
import {Divider, ListItemIcon, ListItemText, MenuItem} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {MenuAction} from "../../models/internal";

interface IProps {
  actions: MenuAction[];
  onActionClick: (actionId: string) => void;
}

const MenuActionItems: FunctionComponent<IProps> = ({actions, onActionClick}) => {
  return (
    <>
      {actions.map((action) => {
        return (
          <React.Fragment key={action.id}>
            {action.dividerTop && <Divider sx={{my: 0.5}} />}

            <MenuItem onClick={() => onActionClick(action.id)}>
              <ListItemIcon>
                <action.icon />
              </ListItemIcon>
              <ListItemText primary={<FormattedMessage id={action.labelKey} />} />
            </MenuItem>

            {action.dividerBottom && <Divider sx={{my: 0.5}} />}
          </React.Fragment>
        );
      })}
    </>
  );
};
export default MenuActionItems;

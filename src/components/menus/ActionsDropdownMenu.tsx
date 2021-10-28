import React, {FunctionComponent, useState} from "react";
import {FormattedMessage} from "react-intl";
import {Button, Menu} from "@mui/material";
import {KeyboardArrowDown} from "@mui/icons-material";
import MenuActionItems from "./MenuActionItems";
import {ButtonSize, MenuAction} from "../../models/internal";

interface IProps {
  dropdownActions: MenuAction[];
  actionsHandler: (id: string) => void;
  size?: ButtonSize;
}

const ActionsDropdownMenu: FunctionComponent<IProps> = ({dropdownActions, actionsHandler, size}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const actionsHandlerInternal = (id: string): void => {
    handleClose();
    actionsHandler(id);
  };

  return (
    <>
      <Button size={size} variant="contained" onClick={handleMenu} endIcon={<KeyboardArrowDown />}>
        <FormattedMessage id="pages.actions" />
      </Button>
      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuActionItems actions={dropdownActions} onActionClick={actionsHandlerInternal} />
      </Menu>
    </>
  );
};

export default ActionsDropdownMenu;

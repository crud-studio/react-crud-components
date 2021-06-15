import React, {FunctionComponent, useState} from "react";
import StatusButton from "../buttons/StatusButton";
import {FormattedMessage} from "react-intl";
import {Button, ButtonGroup, Menu} from "@material-ui/core";
import {KeyboardArrowDown} from "@material-ui/icons";
import MenuActionItems from "./MenuActionItems";
import {ButtonSize, MenuAction} from "../../models/internal";

interface IProps {
  dropdownActions: MenuAction[];
  actionsHandler: (id: string) => void;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

const ButtonDropdownMenu: FunctionComponent<IProps> = ({dropdownActions, actionsHandler, size, loading, className}) => {
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
      <ButtonGroup size={size} variant="contained" disableElevation className={className}>
        <StatusButton loading={loading} color="primary" onClick={() => actionsHandlerInternal(dropdownActions[0].id)}>
          <FormattedMessage id={dropdownActions[0].labelKey} />
        </StatusButton>

        <Button onClick={handleMenu}>
          <KeyboardArrowDown fontSize={size} />
        </Button>
      </ButtonGroup>
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
        <MenuActionItems actions={dropdownActions.slice(1)} onActionClick={actionsHandlerInternal} />
      </Menu>
    </>
  );
};

export default ButtonDropdownMenu;

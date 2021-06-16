import React, {ReactNode, useCallback} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import PageSize from "./components/PageSize";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Box, Button, Divider, Pagination, Typography} from "@material-ui/core";
import {MenuAction} from "../../../models/internal";
import ActionsDropdownMenu from "../../../components/menus/ActionsDropdownMenu";
import ButtonDropdownMenu from "../../../components/menus/ButtonDropdownMenu";

interface IProps<EntityRO> {
  compact: boolean;
  currentPage: number;
  totalPageCount: number;
  onChangePage: (page: number) => void;
  onChangePageSize: (pageSize: number) => void;
  selectedPageSize: number;
  totalItemCount: number;
  startIndex: number;
  endIndex: number;
  heading: string;
  buttons: MenuAction[];
  buttonsHandler: (actionId: string) => void;
  dropdownActions: MenuAction[];
  dropdownActionsHandler: (actionId: string) => void;
}

type ActionsMenuType = "None" | "Buttons" | "ButtonDropdownMenu" | "ActionsDropdownMenu";

const TablePageHeading = <EntityRO extends BaseJpaRO>({
  compact,
  currentPage,
  totalPageCount,
  onChangePage,
  onChangePageSize,
  selectedPageSize,
  totalItemCount,
  startIndex,
  endIndex,
  heading,
  buttons,
  buttonsHandler,
  dropdownActions,
  dropdownActionsHandler,
}: IProps<EntityRO>) => {
  const menusHandler = useCallback(
    (actionId: string): void => {
      if (_.some(buttons, (button) => button.id === actionId)) {
        buttonsHandler(actionId);
      }
      if (_.some(dropdownActions, (dropdownAction) => dropdownAction.id === actionId)) {
        dropdownActionsHandler(actionId);
      }
    },
    [buttons, buttonsHandler, dropdownActions, dropdownActionsHandler]
  );

  const getMenuType = useCallback((): ActionsMenuType => {
    if (!buttons.length && !dropdownActions.length) {
      return "None";
    }

    if (!buttons.length) {
      return "ActionsDropdownMenu";
    }

    if (buttons.length === 1 && !dropdownActions.length) {
      return "Buttons";
    }

    return "ButtonDropdownMenu";
  }, [buttons, dropdownActions]);

  const renderMenu = useCallback(
    (compact: boolean): ReactNode => {
      const menuType = getMenuType();
      switch (menuType) {
        case "None":
          return null;
        case "ActionsDropdownMenu":
          return (
            <ActionsDropdownMenu
              dropdownActions={dropdownActions}
              actionsHandler={menusHandler}
              size={compact ? "small" : "medium"}
            />
          );
        case "Buttons":
          return buttons.map((button) => {
            return (
              <Button
                size={compact ? "small" : "medium"}
                onClick={() => menusHandler(button.id)}
                sx={{ml: 1}}
                key={button.id}
              >
                <FormattedMessage id={button.labelKey} />
              </Button>
            );
          });
        case "ButtonDropdownMenu":
          const menuActions = [
            ...buttons,
            ...(buttons.length > 1
              ? dropdownActions.map((x, index) => (index === 0 ? {...x, dividerTop: true} : x))
              : dropdownActions),
          ];
          return (
            <ButtonDropdownMenu
              dropdownActions={menuActions}
              actionsHandler={menusHandler}
              size={compact ? "small" : "medium"}
            />
          );
      }
    },
    [buttons, dropdownActions, menusHandler, getMenuType]
  );

  return (
    <Box sx={compact ? {pb: 1, pt: 1} : {pb: 3}}>
      <Box
        sx={
          compact
            ? {float: "right"}
            : {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }
        }
      >
        {!compact && (
          <Typography component="h1" variant="h1">
            <FormattedMessage id={heading} />
          </Typography>
        )}

        <Box sx={{ml: 1}}>{renderMenu(compact)}</Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pagination
          page={currentPage}
          count={totalPageCount}
          size="small"
          showFirstButton
          showLastButton
          onChange={(event, page) => onChangePage(page)}
          sx={{display: "inline-block"}}
        />

        <PageSize
          startIndex={startIndex}
          endIndex={endIndex}
          totalItemCount={totalItemCount}
          selectedPageSize={selectedPageSize}
          onChangePageSize={onChangePageSize}
        />
      </Box>

      {!compact && <Divider sx={{mt: 1}} />}
    </Box>
  );
};
export default TablePageHeading;

import React, {FunctionComponent} from "react";
import {FormattedMessage} from "react-intl";
import {Box, Typography} from "@mui/material";
import {MenuAction} from "../../../models/internal";
import ItemEditTime from "../../../components/time/ItemEditTime";
import ActionsDropdownMenu from "../../../components/menus/ActionsDropdownMenu";
import ButtonDropdownMenu from "../../../components/menus/ButtonDropdownMenu";

interface IProps {
  headingKey: string;
  headingSubKey?: string;
  item?: any;
  saving?: boolean;
  hasChanges?: boolean;
  actions?: MenuAction[];
  actionsHandler?: (id: string) => void;
  actionLoading?: boolean;
}

const DetailsPageHeading: FunctionComponent<IProps> = ({
  headingKey,
  headingSubKey,
  item,
  saving,
  hasChanges,
  actions,
  actionsHandler,
  actionLoading,
  children,
}) => {
  return (
    <Box sx={{display: "flex", flexDirection: "row", alignItems: "start", mb: 3}}>
      <Box sx={{flexGrow: 1, overflow: "hidden", pr: 1}}>
        <Typography component="h1" variant="h4" noWrap sx={{display: {xs: "block", md: "inline-flex"}, mr: 1}}>
          <FormattedMessage id={headingKey} />
        </Typography>

        {headingSubKey && (
          <Typography
            component="h2"
            variant="h5"
            noWrap
            sx={{display: {xs: "block", md: "inline-flex"}, color: "text.disabled", mr: 1}}
          >
            <FormattedMessage id={headingSubKey} />
          </Typography>
        )}

        {item && <ItemEditTime item={item} saving={saving} hasChanges={hasChanges} />}
      </Box>

      {(children || (actions && actions.length > 0)) && (
        <div>
          {children}

          {actions && actions.length > 0 && !actions[0].visible && actionsHandler && (
            <ActionsDropdownMenu dropdownActions={actions} actionsHandler={actionsHandler} />
          )}

          {actions && actions.length > 0 && actions[0].visible && actionsHandler && (
            <ButtonDropdownMenu dropdownActions={actions} actionsHandler={actionsHandler} loading={actionLoading} />
          )}
        </div>
      )}
    </Box>
  );
};

export default DetailsPageHeading;

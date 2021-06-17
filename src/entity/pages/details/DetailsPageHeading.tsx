import React, {FunctionComponent} from "react";
import {FormattedMessage} from "react-intl";
import {Box, Divider, Typography} from "@material-ui/core";
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
  separator?: boolean;
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
  separator = true,
  children,
}) => {
  return (
    <Box>
      <Box sx={{display: "flex", flexDirection: "row", alignItems: "start"}}>
        <Box sx={{flexGrow: 1, overflow: "hidden", pr: 1}}>
          <Typography component="h1" variant="h1" noWrap sx={{display: {xs: "block", md: "inline-flex"}, mr: 1}}>
            <FormattedMessage id={headingKey} />
          </Typography>

          {headingSubKey && (
            <Typography component="h2" variant="h3" noWrap sx={{display: {xs: "block", md: "inline-flex"}, mr: 1}}>
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

      {separator && <Divider sx={{mt: 1, mb: 3}} />}
    </Box>
  );
};

export default DetailsPageHeading;
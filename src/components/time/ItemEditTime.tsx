import React, {FunctionComponent, useEffect, useState} from "react";
import {findValues} from "../../helpers/ObjectUtils";
import _ from "lodash";
import {Tooltip, Typography} from "@material-ui/core";
import {DoneOutlined, EditOutlined, PendingOutlined, SaveAltOutlined} from "@material-ui/icons";
import {FormattedMessage} from "react-intl";
import FormattedRelativeTimeNow from "./FormattedRelativeTimeNow";

interface IProps {
  item: any;
  saving?: boolean;
  hasChanges?: boolean;
}

const ItemEditTime: FunctionComponent<IProps> = ({item, saving, hasChanges}) => {
  const getLastUpdateTime = (item: any): number | null | undefined => {
    return _.max(findValues(item, "lastUpdateTime"));
  };

  const [lastUpdateTime, setLastUpdateTime] = useState<number | null | undefined>(getLastUpdateTime(item));

  useEffect(() => {
    if (item) {
      setLastUpdateTime(getLastUpdateTime(item));
    }
  }, [item]);

  return (
    <Typography component="div" variant="body2" noWrap sx={{display: {xs: "block", md: "inline"}}}>
      {!saving && (
        <>
          {hasChanges && (
            <>
              <PendingOutlined fontSize="small" sx={{mb: -0.5, mr: 0.5}} />
              <FormattedMessage id="pages.pending-changes" />
            </>
          )}

          {lastUpdateTime && !hasChanges && (
            <>
              <DoneOutlined fontSize="small" sx={{mb: -0.5, mr: 0.5}} />
              <FormattedMessage id="pages.saved" />

              <Tooltip title={<FormattedMessage id="pages.last-edit" />}>
                <span>
                  <EditOutlined fontSize="small" sx={{mb: -0.5, mr: 0.5, ml: 1}} />
                  <FormattedRelativeTimeNow value={lastUpdateTime} />
                </span>
              </Tooltip>
            </>
          )}
        </>
      )}

      {saving && (
        <>
          <SaveAltOutlined fontSize="small" sx={{mb: -0.5, mr: 0.5}} />
          <FormattedMessage id="pages.saving" />
        </>
      )}
    </Typography>
  );
};

export default ItemEditTime;

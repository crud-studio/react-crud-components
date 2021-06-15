import copy from "copy-to-clipboard";
import {FormattedMessage} from "react-intl";
import React from "react";
import NotificationManager from "../components/notifications/NotificationManager";

export const copyToClipboard = (text: string): void => {
  const copyResult = copy(text);

  if (copyResult) {
    NotificationManager.success(<FormattedMessage id="pages.copy-to-clipboard-success" />, {
      timeOut: 2000,
    });
  } else {
    NotificationManager.warning(<FormattedMessage id="pages.copy-to-clipboard-failed" />, {
      timeOut: 2000,
    });
  }
};

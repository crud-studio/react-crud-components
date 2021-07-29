import copy from "copy-to-clipboard";
import {FormattedMessage} from "react-intl";
import React from "react";
import NotificationManager from "../components/notifications/NotificationManager";

export const CopyToClipboard = {
  text: function (text: string): void {
    if (!text) {
      NotificationManager.warning(<FormattedMessage id="pages.copy-to-clipboard-failed" />, {
        timeOut: 2000,
      });
      return;
    }

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
  },
};

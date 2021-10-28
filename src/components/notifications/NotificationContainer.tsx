import React, {FunctionComponent, useCallback, useState} from "react";
import NotificationManager from "./NotificationManager";
import {Alert, Snackbar} from "@mui/material";
import _ from "lodash";
import {useEffectOnce, useUpdateEffect} from "react-use";
import {NotificationInfo} from "../../models/internal";

interface IProps {}

const NotificationContainer: FunctionComponent<IProps> = ({}) => {
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
  const [newNotification, setNewNotification] = useState<NotificationInfo | undefined>(undefined);
  const [currentNotification, setCurrentNotification] = useState<NotificationInfo | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);

  useUpdateEffect(() => {
    if (notifications.length && !currentNotification) {
      // Set a new snack when we don't have an active one
      setCurrentNotification({...notifications[0]});
      setNotifications((notifications) => notifications.slice(1));
      setOpen(true);
    } else if (notifications.length && currentNotification && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [notifications, currentNotification, open]);

  useUpdateEffect(() => {
    if (!newNotification) {
      return;
    }

    if (
      currentNotification &&
      _.isEqual(currentNotification.type, newNotification.type) &&
      _.isEqual(currentNotification.message, newNotification.message)
    ) {
      return;
    }

    if (
      _.findIndex(notifications, {
        type: newNotification.type,
        message: newNotification.message,
      }) > -1
    ) {
      return;
    }

    setNotifications((notifications) => [...notifications, newNotification]);
  }, [newNotification]);

  useEffectOnce(() => {
    const handleNewNotification = (notification: NotificationInfo) => {
      setNewNotification(notification);
    };

    NotificationManager.addNewNotificationListener(handleNewNotification);
    return () => {
      NotificationManager.removeNewNotificationListener(handleNewNotification);
    };
  });

  const onClick = useCallback((): void => {
    setOpen(false);
  }, [setCurrentNotification]);

  const onClose = useCallback(
    (event?: React.SyntheticEvent | MouseEvent, reason?: string): void => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    },
    [setCurrentNotification]
  );

  const onExited = useCallback((): void => {
    setCurrentNotification(undefined);
  }, [setCurrentNotification]);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={open}
      autoHideDuration={currentNotification?.timeOut || 5000}
      onClick={onClick}
      onClose={onClose}
      TransitionProps={{
        onExited: onExited,
      }}
    >
      <Alert onClose={onClose} severity={currentNotification?.type} action={currentNotification?.action}>
        {currentNotification?.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationContainer;

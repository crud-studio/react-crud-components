import {EventEmitter} from "events";
import {v4 as uuidv4} from "uuid";
import {ReactNode} from "react";
import {NotificationInfo} from "../../models/internal";

export interface NotificationOptions {
  action?: ReactNode;
  timeOut?: number;
}

class NotificationManager extends EventEmitter {
  private static readonly newNotificationEvent: string = "NEW_NOTIFICATION";

  constructor() {
    super();
  }

  create(notificationInfo: NotificationInfo): void {
    const defaultNotification: NotificationInfo = {
      uuid: uuidv4(),
      type: "info",
      message: "",
      timeOut: 5000,
    };

    const notification = Object.assign(defaultNotification, notificationInfo);
    this.emitChange(notification);
  }

  info(message: string | ReactNode, options?: NotificationOptions): void {
    this.create({
      type: "info",
      message,
      ...options,
    });
  }

  success(message: string | ReactNode, options?: NotificationOptions): void {
    this.create({
      type: "success",
      message,
      ...options,
    });
  }

  warning(message: string | ReactNode, options?: NotificationOptions): void {
    this.create({
      type: "warning",
      message,
      ...options,
    });
  }

  error(message: string | ReactNode, options?: NotificationOptions): void {
    this.create({
      type: "error",
      message,
      ...options,
    });
  }

  emitChange(notification: NotificationInfo) {
    this.emit(NotificationManager.newNotificationEvent, notification);
  }

  addNewNotificationListener(listener: (notification: NotificationInfo) => void) {
    this.addListener(NotificationManager.newNotificationEvent, listener);
  }

  removeNewNotificationListener(listener: (notification: NotificationInfo) => void) {
    this.removeListener(NotificationManager.newNotificationEvent, listener);
  }
}

export default new NotificationManager();

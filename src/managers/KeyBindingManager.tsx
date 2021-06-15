import {FunctionComponent, useEffect} from "react";
import _ from "lodash";
import {MenuAction} from "../models/internal";
import Mousetrap from "mousetrap";

interface IProps {
  actions: MenuAction[];
  actionsHandler: (actionId: string) => void;
}

const KeyBindingManager: FunctionComponent<IProps> = ({actions, actionsHandler}) => {
  useEffect(() => {
    Mousetrap.prototype.stopCallback = () => {
      return false;
    };

    _.forEach(actions, (a) => {
      if (a.keyBinding) {
        Mousetrap.bind([`ctrl+${a.keyBinding}`, `command+${a.keyBinding}`], () => {
          actionsHandler(a.id);
          return false;
        });
      }
    });

    return () => {
      _.forEach(actions, (a) => {
        if (a.keyBinding) {
          Mousetrap.unbind(`ctrl+${a.keyBinding}`);
          Mousetrap.unbind(`command+${a.keyBinding}`);
        }
      });
    };
  }, []);

  return null;
};
export default KeyBindingManager;

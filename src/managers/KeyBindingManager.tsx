import {FunctionComponent, useEffect, useState} from "react";
import _ from "lodash";
import {MenuAction} from "../models/internal";
import Mousetrap from "mousetrap";

interface IProps {
  actions: MenuAction[];
  actionsHandler: (actionId: string) => void;
}

const KeyBindingManager: FunctionComponent<IProps> = ({actions, actionsHandler}) => {
  const [actionIdToPerform, setActionIdToPerform] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (actionIdToPerform) {
      actionsHandler(actionIdToPerform);
      setActionIdToPerform(undefined);
    }
  }, [actionIdToPerform]);

  useEffect(() => {
    Mousetrap.prototype.stopCallback = () => {
      return false;
    };

    _.forEach(actions, (a) => {
      if (a.keyBinding) {
        Mousetrap.bind([`ctrl+${a.keyBinding}`, `command+${a.keyBinding}`], () => {
          setActionIdToPerform(a.id);
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

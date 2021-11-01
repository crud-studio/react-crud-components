import React, {FunctionComponent, useEffect} from "react";
import {useUpdateEffect} from "react-use";
import useNetworkStatus from "./hooks/useNetworkStatus";
import useSystemStatus from "./hooks/useSystemStatus";
import NetworkDialog from "./dialogs/NetworkDialog";
import MaintenanceDialog from "./dialogs/MaintenanceDialog";
import {useModal} from "@ebay/nice-modal-react";

interface IProps {
  networkStatusUrl: string;
  supportEmail: string;
}

const MaintenanceManager: FunctionComponent<IProps> = ({networkStatusUrl, supportEmail}) => {
  const networkModal = useModal(NetworkDialog);
  const maintenanceModal = useModal(MaintenanceDialog);

  const networkStatus = useNetworkStatus(networkStatusUrl);
  const systemStatus = useSystemStatus();

  useUpdateEffect(() => {
    if (networkStatus === null) {
      return;
    }

    if (networkStatus) {
      networkModal.hide();
    } else {
      networkModal.show({supportEmail: supportEmail});
      maintenanceModal.hide();
    }
  }, [networkStatus]);

  useEffect(() => {
    if (networkStatus === null || systemStatus === null) {
      return;
    }

    if (systemStatus) {
      maintenanceModal.hide();
    } else if (networkStatus) {
      maintenanceModal.show({supportEmail: supportEmail});
    }
  }, [networkStatus, systemStatus]);

  return null;
};
export default MaintenanceManager;

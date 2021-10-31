import React, {FunctionComponent, useEffect, useState} from "react";
import _ from "lodash";
import {useUpdateEffect} from "react-use";
import useNetworkStatus from "./hooks/useNetworkStatus";
import useSystemStatus from "./hooks/useSystemStatus";
import NetworkDialog from "./dialogs/NetworkDialog";
import MaintenanceDialog from "./dialogs/MaintenanceDialog";
import useModals from "../../contexts/modals/hooks/useModals";

interface IProps {
  networkStatusUrl: string;
  supportEmail: string;
}

const MaintenanceManager: FunctionComponent<IProps> = ({networkStatusUrl, supportEmail}) => {
  const {showModal, hideModal} = useModals();
  const [networkModalId] = useState<string>(_.uniqueId("network_"));
  const [maintenanceModalId] = useState<string>(_.uniqueId("maintenance_"));

  const networkStatus = useNetworkStatus(networkStatusUrl);
  const systemStatus = useSystemStatus();

  useUpdateEffect(() => {
    if (networkStatus === null) {
      return;
    }

    if (networkStatus) {
      hideModal(networkModalId);
    } else {
      showModal(networkModalId);
      hideModal(maintenanceModalId);
    }
  }, [networkStatus]);

  useEffect(() => {
    if (networkStatus === null || systemStatus === null) {
      return;
    }

    if (systemStatus) {
      hideModal(maintenanceModalId);
    } else if (networkStatus) {
      showModal(maintenanceModalId);
    }
  }, [networkStatus, systemStatus]);

  return (
    <>
      <NetworkDialog modalId={networkModalId} supportEmail={supportEmail} />
      <MaintenanceDialog modalId={maintenanceModalId} supportEmail={supportEmail} />
    </>
  );
};
export default MaintenanceManager;

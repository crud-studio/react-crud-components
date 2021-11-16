import React, {FunctionComponent, PropsWithChildren, useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {notEmpty, useRemoteStorage} from "@crud-studio/react-crud-core";
import {useNavigate} from "react-router-dom";
import useTours from "../tours/hooks/useTours";
import {TourInfo} from "../tours/ToursContext";

const remoteStoragePrefixWizard = "wizard-";
const remoteStoragePrefixWizardStep = "wizard-step-";

export type WizardConfig = {
  id: string; // Must be unique
  titleKey: string;
  descriptionKey: string;
  steps: WizardStepConfig[];
};

export type WizardStepConfig = {
  id: string; // Must be unique across all wizards
  titleKey: string;
  descriptionKey: string;
  url: string | null;
  imageUrl: string;
  minutes: number;
  completeManually: boolean;
};

export type WizardStatus = {
  id: string;
  isCompleted: boolean;
  isDismissed: boolean;
  isMinimized: boolean;
  completedTime?: number;
  percentComplete: number;
};

export type WizardStepStatus = {
  id: string;
  statusUpdateTime: number;
  status: "New" | "Skipped" | "Completed";
};

export type WizardRemoteStorageData = WizardStatus;
export type WizardStepRemoteStorageData = WizardStepStatus;

export type WizardsContextProps = {
  wizards: WizardConfig[];
  wizardStatuses: WizardStatus[] | undefined;
  wizardStepStatuses: WizardStepStatus[] | undefined;
  updatedWizardStatus: WizardStatus | undefined;
  updatedWizardStepStatus: WizardStepStatus | undefined;
  startedWizardStepId: string | undefined;
  getWizardConfig: (wizardId: string) => WizardConfig | undefined;
  getWizardStatus: (wizardId: string) => WizardStatus | undefined;
  getWizardStepConfig: (wizardStepId: string) => WizardStepConfig | undefined;
  getWizardStepStatus: (wizardStepId: string) => WizardStepStatus | undefined;
  getWizardId: (wizardStep: string | WizardStepConfig | WizardStepStatus) => string | undefined;
  dismissWizard: (wizardId: string) => void;
  minimizeWizard: (wizardId: string) => void;
  completeWizardStep: (wizardStepId: string) => void;
  skipWizardStep: (wizardStepId: string) => void;
  startWizardStep: (wizardStepId: string) => void;
};

const WizardsContext = React.createContext<WizardsContextProps>(undefined!);

export interface WizardsProviderProps extends PropsWithChildren<any> {
  wizards: WizardConfig[];
  active: boolean;
}

const WizardsProvider: FunctionComponent<WizardsProviderProps> = ({wizards, active, children}) => {
  const {initialized, getValue, setValue} = useRemoteStorage();
  const navigate = useNavigate();
  const {completedTourIds, getTour, startTour} = useTours();

  const [wizardStatuses, setWizardStatuses] = useState<WizardStatus[] | undefined>(undefined);
  const [wizardStepStatuses, setWizardStepStatuses] = useState<WizardStepStatus[] | undefined>(undefined);
  const [startedWizardStepId, setStartedWizardStepId] = useState<string | undefined>(undefined);
  const [updatedWizardStatus, setUpdatedWizardStatus] = useState<WizardStatus | undefined>(undefined);
  const [updatedWizardStepStatus, setUpdatedWizardStepStatus] = useState<WizardStepStatus | undefined>(undefined);

  const getRemoteStorageIdentifierWizard = useCallback((wizard: string | WizardConfig | WizardStatus): string => {
    const wizardId = _.isString(wizard) ? wizard : wizard.id;
    return `${remoteStoragePrefixWizard}${wizardId}`;
  }, []);

  const getRemoteStorageIdentifierWizardStep = useCallback(
    (wizardStep: string | WizardStepConfig | WizardStepStatus): string => {
      const wizardStepId = _.isString(wizardStep) ? wizardStep : wizardStep.id;
      return `${remoteStoragePrefixWizardStep}${wizardStepId}`;
    },
    []
  );

  useEffect(() => {
    if (initialized) {
      setWizardStatuses(
        wizards
          .map<WizardStatus | null>((w) => getValue<WizardRemoteStorageData>(getRemoteStorageIdentifierWizard(w)))
          .filter(notEmpty)
      );
      setWizardStepStatuses(
        _.flatten<WizardStepConfig>(wizards.map<WizardStepConfig[]>((w) => w.steps))
          .map<WizardStepStatus | null>((s) =>
            getValue<WizardStepRemoteStorageData>(getRemoteStorageIdentifierWizardStep(s))
          )
          .filter(notEmpty)
      );
    }
  }, [initialized]);

  const getWizardId = useCallback(
    (wizardStep: string | WizardStepConfig | WizardStepStatus): string | undefined => {
      const wizardStepId = _.isString(wizardStep) ? wizardStep : wizardStep.id;
      return _.find(wizards, (w) => _.some(w.steps, (step) => step.id === wizardStepId))?.id;
    },
    [wizards]
  );

  const getTourEvent = useCallback(
    (wizardStep: string | WizardStepConfig | WizardStepStatus): string | undefined => {
      const wizardStepId = _.isString(wizardStep) ? wizardStep : wizardStep.id;
      return `wizard-${wizardStepId}`;
    },
    [wizards]
  );

  const getWizardConfig = useCallback(
    (wizardId: string): WizardConfig | undefined => {
      return _.find(wizards, (s) => s.id === wizardId);
    },
    [wizards]
  );

  const getWizardStatus = useCallback(
    (wizardId: string): WizardStatus | undefined => {
      return wizardStatuses
        ? _.find(wizardStatuses, (s) => s.id === wizardId) || {
            id: wizardId,
            completedTime: undefined,
            isCompleted: false,
            isDismissed: false,
            isMinimized: false,
            percentComplete: 0,
          }
        : undefined;
    },
    [wizardStatuses]
  );

  const getWizardStepConfig = useCallback(
    (wizardStepId: string): WizardStepConfig | undefined => {
      return _.find(
        _.flatten<WizardStepConfig>(wizards.map<WizardStepConfig[]>((w) => w.steps)),
        (wizardStepConfig) => wizardStepConfig.id === wizardStepId
      );
    },
    [wizards]
  );

  const getWizardStepStatus = useCallback(
    (wizardStepId: string): WizardStepStatus | undefined => {
      return wizardStepStatuses
        ? _.find(wizardStepStatuses, (s) => s.id === wizardStepId) || {
            id: wizardStepId,
            status: "New",
            statusUpdateTime: 0,
          }
        : undefined;
    },
    [wizardStepStatuses]
  );

  const updateWizardStatus = useCallback(
    (updatedWizardStatus: WizardStatus): void => {
      setUpdatedWizardStatus(updatedWizardStatus);

      setValue<WizardRemoteStorageData>(getRemoteStorageIdentifierWizard(updatedWizardStatus.id), updatedWizardStatus);

      setWizardStatuses((currentWizardStatuses) => [
        ...(currentWizardStatuses || []).filter((s) => s.id !== updatedWizardStatus.id),
        updatedWizardStatus,
      ]);
    },
    [setValue, getRemoteStorageIdentifierWizard, setWizardStatuses, setUpdatedWizardStatus]
  );

  const dismissWizard = useCallback(
    (wizardId: string): void => {
      const wizardStatus = getWizardStatus(wizardId);
      if (!wizardStatus) {
        return;
      }

      if (wizardStatus.isCompleted || wizardStatus.isDismissed) {
        return;
      }

      const updatedWizardStatus: WizardStatus = {
        id: wizardId,
        isCompleted: !!wizardStatus.isCompleted,
        isDismissed: true,
        isMinimized: !!wizardStatus.isMinimized,
        completedTime: wizardStatus.completedTime,
        percentComplete: wizardStatus.percentComplete,
      };

      updateWizardStatus(updatedWizardStatus);
    },
    [getWizardStatus, updateWizardStatus]
  );

  const minimizeWizard = useCallback(
    (wizardId: string): void => {
      const wizardStatus = getWizardStatus(wizardId);
      if (!wizardStatus) {
        return;
      }

      if (wizardStatus.isCompleted || wizardStatus.isDismissed || wizardStatus.isMinimized) {
        return;
      }

      const updatedWizardStatus: WizardStatus = {
        id: wizardId,
        isCompleted: !!wizardStatus.isCompleted,
        isDismissed: !!wizardStatus.isDismissed,
        isMinimized: true,
        completedTime: wizardStatus.completedTime,
        percentComplete: wizardStatus.percentComplete,
      };

      updateWizardStatus(updatedWizardStatus);
    },
    [getWizardStatus, updateWizardStatus]
  );

  const refreshWizardStatus = useCallback(
    (updatedWizardStepStatus: WizardStepStatus): void => {
      if (!wizardStepStatuses) {
        return;
      }

      const wizardId = getWizardId(updatedWizardStepStatus.id);
      if (!wizardId) {
        return;
      }

      const wizardStatus = getWizardStatus(wizardId);
      if (!wizardStatus) {
        return;
      }

      if (wizardStatus.isCompleted) {
        return;
      }

      const wizardConfig = getWizardConfig(wizardId);
      if (!wizardConfig) {
        return;
      }

      const selectedWizardStepStatuses = [
        updatedWizardStepStatus,
        ...wizardStepStatuses.filter(
          (wizardStepStatus) =>
            wizardStepStatus.id !== updatedWizardStepStatus.id && getWizardId(wizardStepStatus) === wizardId
        ),
      ];
      const wizardStepsCount = wizardConfig.steps.length;
      const completedWizardStepsCount = selectedWizardStepStatuses.filter(
        (wizardStepStatus) => wizardStepStatus.status === "Skipped" || wizardStepStatus.status === "Completed"
      ).length;

      const isCompleted = completedWizardStepsCount >= wizardStepsCount;
      const updatedWizardStatus: WizardStatus = {
        id: wizardId,
        isCompleted: isCompleted,
        isDismissed: !!wizardStatus.isDismissed,
        isMinimized: !!wizardStatus.isMinimized,
        completedTime: isCompleted ? new Date().getTime() : undefined,
        percentComplete: Math.round((completedWizardStepsCount / wizardStepsCount) * 100),
      };

      updateWizardStatus(updatedWizardStatus);
    },
    [wizardStepStatuses, getWizardId, getWizardStatus, getWizardConfig, updateWizardStatus]
  );

  const updateWizardStepStatus = useCallback(
    (updatedWizardStepStatus: WizardStepStatus): void => {
      setUpdatedWizardStepStatus(updatedWizardStepStatus);

      setValue<WizardStepRemoteStorageData>(
        getRemoteStorageIdentifierWizardStep(updatedWizardStepStatus.id),
        updatedWizardStepStatus
      );

      setWizardStepStatuses((currentWizardStepStatuses) => [
        ...(currentWizardStepStatuses || []).filter((s) => s.id !== updatedWizardStepStatus.id),
        updatedWizardStepStatus,
      ]);

      refreshWizardStatus(updatedWizardStepStatus);
    },
    [setUpdatedWizardStepStatus, setValue, setWizardStepStatuses, refreshWizardStatus]
  );

  const completeWizardStep = useCallback(
    (wizardStepId: string): void => {
      const wizardStepStatus = getWizardStepStatus(wizardStepId);
      if (!wizardStepStatus) {
        return;
      }

      if (wizardStepStatus.status === "Completed") {
        return;
      }

      const updatedWizardStepStatus: WizardStepStatus = {
        id: wizardStepId,
        status: "Completed",
        statusUpdateTime: new Date().getTime(),
      };

      updateWizardStepStatus(updatedWizardStepStatus);
    },
    [getWizardStepStatus, updateWizardStepStatus]
  );

  const skipWizardStep = useCallback(
    (wizardStepId: string): void => {
      const wizardStepStatus = getWizardStepStatus(wizardStepId);
      if (!wizardStepStatus) {
        return;
      }

      if (wizardStepStatus.status === "Completed" || wizardStepStatus.status === "Skipped") {
        return;
      }

      const updatedWizardStepStatus: WizardStepStatus = {
        id: wizardStepId,
        status: "Skipped",
        statusUpdateTime: new Date().getTime(),
      };

      updateWizardStepStatus(updatedWizardStepStatus);
    },
    [getWizardStepStatus, updateWizardStepStatus]
  );

  const startWizardStep = useCallback(
    (wizardStepId): void => {
      const wizardStepConfig = getWizardStepConfig(wizardStepId);
      if (!wizardStepConfig) {
        return;
      }

      setStartedWizardStepId(wizardStepId);

      if (wizardStepConfig.url) {
        navigate(wizardStepConfig.url);
      }

      startTour({event: getTourEvent(wizardStepConfig)});
    },
    [getWizardStepConfig]
  );

  const isTourMatchingWizardStep = useCallback((tour: TourInfo, wizardStepConfig: WizardStepConfig): boolean => {
    const tourEvent = getTourEvent(wizardStepConfig);
    if (!_.find(tour.events, (event) => event.id === tourEvent)) {
      return false;
    }
    if (_.isNil(wizardStepConfig.url) && !_.isNil(tour.urls)) {
      return false;
    }
    if (!_.isNil(wizardStepConfig.url) && !_.includes(tour.urls, wizardStepConfig.url)) {
      return false;
    }
    return true;
  }, []);

  useEffect(() => {
    const completedTourId = _.first(completedTourIds); // It doesn't we check only the first tour id because they must have the same prerequisites
    if (!completedTourId) {
      return;
    }

    if (!startedWizardStepId) {
      return;
    }

    const startedWizardStepConfig = getWizardStepConfig(startedWizardStepId);
    if (!startedWizardStepConfig) {
      return;
    }

    if (startedWizardStepConfig.completeManually) {
      return;
    }

    const tour = getTour(completedTourId);
    if (!tour) {
      return;
    }

    if (!isTourMatchingWizardStep(tour, startedWizardStepConfig)) {
      return;
    }

    completeWizardStep(startedWizardStepId);
  }, [completedTourIds]);

  return (
    <WizardsContext.Provider
      value={{
        wizards,
        wizardStatuses,
        wizardStepStatuses,
        updatedWizardStatus,
        updatedWizardStepStatus,
        startedWizardStepId,
        getWizardConfig,
        getWizardStatus,
        getWizardStepConfig,
        getWizardStepStatus,
        getWizardId,
        dismissWizard,
        minimizeWizard,
        completeWizardStep,
        skipWizardStep,
        startWizardStep,
      }}
    >
      {children}
    </WizardsContext.Provider>
  );
};

export {WizardsContext, WizardsProvider};

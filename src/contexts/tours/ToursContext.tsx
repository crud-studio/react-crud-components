import React, {FunctionComponent, PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {useIntl} from "react-intl";
import _ from "lodash";
import {useLocation, useWindowSize} from "react-use";
import {useTheme} from "@mui/material/styles";
import {useRemoteStorage} from "@crud-studio/react-crud-core";
import {matchPath} from "react-router-dom";
import ReactJoyride, {Placement, Step} from "react-joyride";
import {disableBodyScroll, enableBodyScroll} from "body-scroll-lock";

const remoteStoragePrefix = "tour-";

export type TourStep = {
  target: string;
  contentKey: string;
  content?: string;
  placement?: Placement | "auto" | "center";
  action?: (node: any) => void;
};

export type TourEvent = {
  id: string;
  recurring: boolean;
};

export type TourInfo = {
  id: string;
  priority: number;
  urls: string[] | null;
  events: TourEvent[];
  grouping: string;
  steps: TourStep[];
};

export type TourRemoteStorageData = boolean;

export type ToursContextProps = {
  startTour: (options?: {event?: string}) => void;
  stopTour: () => void;
};

const ToursContext = React.createContext<ToursContextProps>(undefined!);

export interface ToursProviderProps extends PropsWithChildren<any> {
  tours: TourInfo[];
  active: boolean;
  toursMinWidth?: number;
}

const ToursProvider: FunctionComponent<ToursProviderProps> = ({tours, active, toursMinWidth = 768, children}) => {
  const theme = useTheme();
  const intl = useIntl();
  const location = useLocation();
  const windowSize = useWindowSize();
  const {initialized, getValue, setValue} = useRemoteStorage();

  const [openTourIds, setOpenTourIds] = useState<string[] | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);

  const [runToursConfig, setRunToursConfig] = useState<{event: string; pathname: string} | null>(null);
  const [delayFlag, setDelayFlag] = useState<boolean>(true);

  const htmlElRef = useRef<HTMLDivElement>(null);

  const isTourMatchingUrl = useCallback((tour: TourInfo, pathname: string): boolean => {
    return !tour.urls || _.some(tour.urls, (url) => !!matchPath({path: url}, pathname));
  }, []);

  const getRemoteStorageIdentifier = useCallback((tour: string | TourInfo): string => {
    const tourId = _.isString(tour) ? tour : tour.id;
    return `${remoteStoragePrefix}${tourId}`;
  }, []);

  const getRelevantTours = useCallback(
    (event: string, pathname: string): TourInfo[] => {
      return _.chain(tours)
        .filter((tour) => {
          const tourEvent = _.find(tour.events, {id: event});
          if (!tourEvent) {
            return false;
          }
          if (!isTourMatchingUrl(tour, pathname)) {
            return false;
          }
          if (!tourEvent.recurring && getValue<TourRemoteStorageData>(getRemoteStorageIdentifier(tour))) {
            return false;
          }
          return true;
        })
        .groupBy("grouping")
        .values()
        .minBy((tours) => {
          let tour = _.minBy(tours, "priority");
          return tour && tour.priority;
        })
        .value();
    },
    [tours, getValue]
  );

  const mergeAndProcessToursSteps = useCallback((tours: TourInfo[]): Step[] => {
    return _.chain(tours)
      .map<TourStep[]>((tour) => tour.steps)
      .flatten()
      .map<Step>((step: TourStep) => ({
        ...step,
        content: intl.formatMessage({id: step.contentKey}),
        disableBeacon: true,
      }))
      .value();
  }, []);

  const runRelevantTours = useCallback(
    (event: string, pathname: string): void => {
      if (!active) {
        return;
      }

      if (!initialized) {
        return;
      }

      if (!!openTourIds) {
        return;
      }

      if (windowSize.width < toursMinWidth) {
        return;
      }

      let relevantTours = getRelevantTours(event, pathname);
      if (!relevantTours || !relevantTours.length) {
        return;
      }

      let relevantToursSteps = mergeAndProcessToursSteps(relevantTours);
      if (!relevantToursSteps || !relevantToursSteps.length) {
        return;
      }

      setSteps(relevantToursSteps);
      setOpenTourIds(_.map(relevantTours, (tour) => tour.id));
      setDelayFlag(false);
    },
    [
      active,
      initialized,
      openTourIds,
      windowSize.width,
      getRelevantTours,
      mergeAndProcessToursSteps,
      setSteps,
      setOpenTourIds,
      setDelayFlag,
    ]
  );

  const startTour = useCallback((options?: {event?: string; pathname?: string}): void => {
    setRunToursConfig({event: options?.event || "default", pathname: options?.pathname || window.location.pathname});
  }, []);

  const stopTour = useCallback((): void => {
    setOpenTourIds(null);
  }, [setOpenTourIds]);

  useEffect(() => {
    if (runToursConfig) {
      runRelevantTours(runToursConfig.event, runToursConfig.pathname);
    }
  }, [runToursConfig]);

  useEffect(() => {
    if (!delayFlag) {
      _.delay(setDelayFlag, 100, true);
    }
  }, [delayFlag]);

  useEffect(() => {
    openTourIds?.forEach((tourId) => {
      if (!getValue<TourRemoteStorageData>(getRemoteStorageIdentifier(tourId))) {
        setValue<TourRemoteStorageData>(getRemoteStorageIdentifier(tourId), true);
      }
    });
  }, [openTourIds]);

  useEffect(() => {
    if (location) {
      const pathname = location.pathname || "/";
      if (!!openTourIds) {
        const openTour = _.find(tours, (tour) => openTourIds.includes(tour.id));
        if (!openTour || !isTourMatchingUrl(openTour, pathname)) {
          stopTour();
          startTour({pathname: pathname});
        }
      } else {
        startTour({pathname: pathname});
      }
    }
  }, [location, initialized]);

  useEffect(() => {
    if (windowSize.width < toursMinWidth && !!openTourIds) {
      stopTour();
    }
  }, [windowSize.width]);

  useEffect(() => {
    if (htmlElRef && htmlElRef.current) {
      if (!!openTourIds) {
        disableBodyScroll(htmlElRef.current);
      } else {
        enableBodyScroll(htmlElRef.current);
      }
    }
  }, [openTourIds]);

  return (
    <ToursContext.Provider value={{startTour, stopTour}}>
      <div ref={htmlElRef} id="tours-scroll-lock" />

      {delayFlag && (
        <ReactJoyride
          steps={steps}
          run={!!openTourIds}
          showProgress={false}
          continuous={true}
          disableOverlay={false}
          disableOverlayClose={false}
          scrollToFirstStep={false}
          showSkipButton={true}
          callback={({status}) => {
            if (status === "finished" || status === "error" || status === "skipped") {
              stopTour();
            }
          }}
          locale={{
            back: intl.formatMessage({id: "pages.back"}),
            close: intl.formatMessage({id: "pages.close"}),
            last: intl.formatMessage({id: "pages.finish"}),
            next: intl.formatMessage({id: "pages.next"}),
            open: intl.formatMessage({id: "pages.open"}),
            skip: intl.formatMessage({id: "pages.skip"}),
          }}
          floaterProps={{
            disableAnimation: true,
          }}
          styles={{
            options: {
              arrowColor: theme.palette.background.paper,
              backgroundColor: theme.palette.background.paper,
              primaryColor: theme.palette.primary.main,
              textColor: theme.palette.text.primary,
              zIndex: 9000,
            },
            buttonNext: {
              outlineColor: theme.palette.primary.main,
            },
          }}
        />
      )}

      {children}
    </ToursContext.Provider>
  );
};

export {ToursContext, ToursProvider};

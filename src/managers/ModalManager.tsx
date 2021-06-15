import React, {FunctionComponent, PropsWithChildren, useCallback, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";

interface IModalsContext {
  hasOpenModal: boolean;
  modalOpenIds: string[];
  isModalOpen: (modalId: string) => boolean;
  getModalKey: (modalId: string) => string;
  showModal: (modalId: string) => void;
  hideModal: (modalId: string) => void;
  hideModalWrapper: (modalId: string) => () => void;
}

export const ModalsContext = React.createContext<IModalsContext>(undefined!);

interface IProps extends PropsWithChildren<any> {}

const ModalManager: FunctionComponent<IProps> = ({children}) => {
  const [modalOpenIds, setModalOpenIds] = useState<string[]>([]);
  const [modalKeys, setModalKeys] = useState<{[index: string]: string}>({});
  const [hasOpenModal, setHasOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setHasOpenModal(modalOpenIds && modalOpenIds.length > 0);
  }, [modalOpenIds]);

  const showModal = useCallback(
    (modalId: string): void => {
      if (!modalId) {
        return;
      }

      if (modalOpenIds.includes(modalId)) {
        return;
      }

      setModalKeys((modalKeys: any) => {
        return {
          ...modalKeys,
          ...{[modalId]: uuidv4()},
        };
      });

      setModalOpenIds((modalOpenIds) => {
        return !modalOpenIds.includes(modalId) ? [...modalOpenIds, modalId] : modalOpenIds;
      });
    },
    [modalOpenIds, setModalOpenIds]
  );

  const hideModal = useCallback(
    (modalId: string): void => {
      if (!modalId) {
        return;
      }

      if (!modalOpenIds.includes(modalId)) {
        return;
      }

      setModalOpenIds((modalOpenIds) => {
        return modalOpenIds.includes(modalId) ? modalOpenIds.filter((x) => x !== modalId) : modalOpenIds;
      });
    },
    [modalOpenIds, setModalOpenIds]
  );

  const hideModalWrapper = useCallback(
    (modalId: string): (() => void) => {
      return () => hideModal(modalId);
    },
    [hideModal]
  );

  const isModalOpen = useCallback(
    (modalId): boolean => {
      return modalId && modalOpenIds.includes(modalId);
    },
    [modalOpenIds]
  );

  const getModalKey = useCallback(
    (modalId: string): string => {
      return modalKeys[modalId] || modalId;
    },
    [modalKeys]
  );

  return (
    <ModalsContext.Provider
      value={{
        hasOpenModal,
        modalOpenIds,
        isModalOpen,
        getModalKey,
        showModal,
        hideModal,
        hideModalWrapper,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
};

export default ModalManager;

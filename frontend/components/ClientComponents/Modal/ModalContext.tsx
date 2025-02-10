import { createContext, type ReactNode, useContext } from 'react';

export interface IModalContext {
  openModal: (modalTitle: string, modalContent: ReactNode, closeHandler?: () => void, fullScreen?: boolean) => void;
  closeModal: () => void;
  closeModalWithEvent: (googleAnalyticsEvent: string) => void;
  isModalOpen: boolean;
}

export const ModalContext = createContext<IModalContext>({
  openModal: () => {},
  closeModal: () => {},
  closeModalWithEvent: () => {},
  isModalOpen: false
});

export const useModalContext = () => {
  const context = useContext<IModalContext>(ModalContext);
  // if context is undefined this means it was used outside of its provider
  if (!context) {
    throw new Error('useModalContext must be used under <ModalContextProvider/>');
  }
  return context;
};

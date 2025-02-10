import { createContext, useContext } from 'react'

export interface ILoadingContext {
  openLoadingIndicator: (message?: string) => void
  closeLoadingIndicator: () => void
}

export const LoadingContext = createContext<ILoadingContext>({
  openLoadingIndicator: () => { },
  closeLoadingIndicator: () => { }
})

export const useLoadingContext = () => {
  const context = useContext<ILoadingContext>(LoadingContext)
  // if context is undefined this means it was used outside of its provider
  if (!context) {
    throw new Error(
      'useLoadingContext must be used under <LoadingContextProvider/>'
    )
  }
  return context
}

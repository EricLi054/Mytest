'use client'
import { useState, type PropsWithChildren } from 'react'
import { type ILoadingContext, LoadingContext } from './LoadingContext'
import { LoadingScreen } from './LoadingScreen'

export interface LoadingProviderProps extends PropsWithChildren { }

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children
}) => {
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined)

  const openLoadingIndicator = (message?: string) => {
    setLoading(true)
    setLoadingMessage(message)
  }

  const closeLoadingIndicator = () => {
    setLoading(false)
    setLoadingMessage(undefined)
  }

  const ProviderValues: ILoadingContext = {
    openLoadingIndicator,
    closeLoadingIndicator
  }

  return (
    <LoadingContext.Provider value={ProviderValues}>
        <LoadingScreen loading={loading}
                       loadingMessage={loadingMessage} />
        {children}
    </LoadingContext.Provider>
  )
}

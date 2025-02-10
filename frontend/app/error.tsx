'use client'
import { RacwaLoadingModal } from '@racwa/react-components'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}): React.ReactElement {
  const router = useRouter()
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    if (error.message === 'Unauthorized') {
      void signIn('azure-ad-b2c', { callbackUrl: window.location.href })
    } else {
      router.push('/error')
    }
  }, [error, router])

  return (
    <RacwaLoadingModal open={true} />
  )
}

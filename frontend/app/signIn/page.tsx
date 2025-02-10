'use client'

import checkHasCookie from '@/utilities/checkHasCookie'
import { RacwaLoadingModal } from '@racwa/react-components'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const authToSitecore = async() => {
  const isSitecoreAuthed = await checkHasCookie('.AspNet.Cookies')
  const isRacDomain = window.location.hostname.includes('ractest.com.au') || window.location.hostname.includes('rac.com.au')
  return (!isSitecoreAuthed && isRacDomain)
}

export default function Signin(): React.ReactElement {
  const searchParams = useSearchParams()
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    document.title = 'Log In to RAC WA'
    if (status === 'loading') return

    const doAuthentication = async() => {
      const doSitecoreAuth = await authToSitecore()

      if (doSitecoreAuth) {
        router.push('/api/oidc/SignIn')
      } else {
        if (searchParams.get('error')) {
          router.push('/')
        } else {
          const callback = searchParams.get('callbackUrl') ?? '/myrac'
          if (status === 'unauthenticated' || searchParams.get('refresh')) {
            await signIn('azure-ad-b2c', { callbackUrl: callback })
          } else if (status === 'authenticated') {
            router.push(callback)
          }
        }
      }
    }

    void doAuthentication()
  }, [status, searchParams, router])

  return <RacwaLoadingModal open={true} />
}

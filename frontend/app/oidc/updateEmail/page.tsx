'use client';

import { getADB2CUpdateEmailUrl } from '@/utilities/adb2c';
import { RacwaLoadingModal } from '@racwa/react-components';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function UpdateEmail(): React.ReactElement {
  const router = useRouter();
  const params = useSearchParams();
  // force authentication and come back here after
  const { status, update } = useSession({
    required: true,
    onUnauthenticated() {
      signIn('azure-ad-b2c', { callbackUrl: '/oidc/updateEmail' }).catch((error) => {
        console.error(error);
        router.push('/');
      });
    }
  });

  useEffect(() => {
    document.title = 'myRAC';
    // when authenticated, if we have the params we have updated the email, otherwise start the journey
    // if not authenticated the useSession above will kick in
    if (status === 'authenticated') {
      const redirectUri = params.get('state');
      const code = params.get('code');
      if (redirectUri) {
        if (code) {
          update({ code }).then(
            () => {
              router.push(redirectUri);
            },
            (err) => {
              console.error(err);
              router.push(redirectUri);
            }
          );
        } else {
          // when cancelling the journey we hit this case
          router.push(redirectUri);
        }
      } else {
        // do we want this to be customisable?
        const redirectUrl = '/myrac/profile/contact-details';

        getADB2CUpdateEmailUrl(redirectUrl, window.location.href).then(
          (updateEmailUrl) => {
            router.push(updateEmailUrl);
          },
          (err) => {
            console.error(err);
          }
        );
      }
    }
    // this should only run once on load hence the empty deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RacwaLoadingModal open={true} />;
}

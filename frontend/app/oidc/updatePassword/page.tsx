'use client';

import { getADB2CUpdatePasswordUrl } from '@/utilities/adb2c';
import { RacwaLoadingModal } from '@racwa/react-components';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function UpdatePassword(): React.ReactElement {
  const router = useRouter();
  const params = useSearchParams();
  // force authentication and come back here after
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn('azure-ad-b2c', { callbackUrl: '/oidc/updatePassword' }).catch((error) => {
        console.error(error);
        router.push('/');
      });
    }
  });

  useEffect(() => {
    document.title = 'myRAC';
    // when authenticated, if we have a param we have updated the password, otherwise start the journey
    // if not authenticated the useSession above will kick in
    if (status === 'authenticated') {
      const redirectUri = params.get('state');
      if (redirectUri) {
        router.push(redirectUri);
      } else {
        // do we want this to be customisable?
        const redirectUrl = '/myrac/profile/contact-details';

        getADB2CUpdatePasswordUrl(redirectUrl, window.location.href).then(
          (updatePasswordUrl) => {
            router.push(updatePasswordUrl);
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

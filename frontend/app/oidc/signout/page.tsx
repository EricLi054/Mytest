'use client';

import { getADB2CLogoutUrl } from '@/utilities/adb2c';
import getHeader from '@/utilities/getHeader';
import { RacwaLoadingModal } from '@racwa/react-components';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignOutPage(): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    const signOutAsync = async () => {
      const referer = await getHeader('Referer');
      const logoutUrl = await getADB2CLogoutUrl(window.location.origin);

      // only navigate to ADB2C page if we came here from our application
      // don't want this if we hit this page from ADB2C SSO
      if (referer?.startsWith(window.location.origin)) {
        await signOut({ redirect: false });
        router.push(logoutUrl);
      } else {
        await signOut({ callbackUrl: '/' });
      }
    };
    void signOutAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RacwaLoadingModal open={true} />;
}

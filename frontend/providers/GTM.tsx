'use client';
import { logPageView } from '@/utilities/analyticsTagging';
import { type GTMParams } from '@next/third-parties/dist/types/google';
import { GoogleTagManager } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const GTM = (props: GTMParams) => {
  const pathname = usePathname();
  const [gtmInitialised, setGtmInitialised] = useState(false);

  useEffect(() => {
    setGtmInitialised(true);
  }, []);

  useEffect(() => {
    // Only need to fire a virtual page view if the path changes without a full re-render
    if (gtmInitialised) {
      logPageView();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div id='gtm-container'>
      <GoogleTagManager {...props} />
    </div>
  );
};

export default GTM;

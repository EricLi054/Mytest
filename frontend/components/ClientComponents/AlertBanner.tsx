'use client';

import { RacwaOverhangNotification } from '@racwa/react-components';
import { useState } from 'react';
import FontAwesomeIcon from './FontAwesomeIcon';
import { type BannerAlertProps } from '@/types/cmsTypes/BannerAlertProps';
import BaseRichTextRenderer from '../DataDrivenForm/dynamic-components/BaseRichTextRenderer';

const AlertBanner = ({ bannerAlert }: { bannerAlert: BannerAlertProps }) => {
  const [_in, setIn] = useState(true);
  return (
    <RacwaOverhangNotification
      in={_in}
      onClose={() => {
        setIn(false);
      }}
      icon={<FontAwesomeIcon icon={bannerAlert.icon} />}
      title={bannerAlert.title}
    >
      <BaseRichTextRenderer richText={bannerAlert.bodyText} />
    </RacwaOverhangNotification>
  );
};

export default AlertBanner;

'use client';

import { StyledLink } from '@/components/StyledComponents/Link.styled';
import { logEvent } from '@/utilities/analyticsTagging';
import { errorPage } from '@/utilities/errorPage';
import { useRouter, useSearchParams } from 'next/navigation';
import FontAwesomeIcon from './FontAwesomeIcon';
import { type LinkProps } from '@/types/cmsTypes/LinkProps';

export const ReturnLink = ({ longLinkText, linkUrl }: LinkProps) => {
  const router = useRouter();
  try {
    const searchParams = useSearchParams();
    const url = searchParams.get('return_url');

    if (!url) {
      return (
        <StyledLink
          href={linkUrl}
          sx={{ fontSize: 14 }}
          onClick={() => {
            logEvent(`Back to ${longLinkText}`);
          }}
        >
          <FontAwesomeIcon icon='chevron-left' style={{ marginRight: 4, fontSize: 12 }} />
          {longLinkText}
        </StyledLink>
      );
    }

    const returnUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    const href = new URL(returnUrl).href;

    return (
      <StyledLink
        href={href}
        sx={{ fontSize: 16 }}
        onClick={() => {
          logEvent(longLinkText);
        }}
      >
        {longLinkText}
      </StyledLink>
    );
  } catch (error) {
    router.push(errorPage.somethingWentWrong);
  }
};

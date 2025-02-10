'use client';
import { StyledLink } from '@/components/StyledComponents/Link.styled';
import { MFAChannel } from '../Types/MFAEnums';
import { useMFAModalContext } from '../Context/MFAModalContext';

export interface ChangeMFAChannelLinkProps {
  handleMFAChannelChange: () => void;
}

export const ChangeMFAChannelLink: React.FC<ChangeMFAChannelLinkProps> = ({ handleMFAChannelChange }) => {
  const { channel, contentDefinition } = useMFAModalContext();
  return (
    <StyledLink href='' onClick={handleMFAChannelChange}>
      {channel === MFAChannel.sms
        ? contentDefinition?.smsAlternateMethodLinkText
        : contentDefinition?.phoneAlternateMethodLinkText}
    </StyledLink>
  );
};

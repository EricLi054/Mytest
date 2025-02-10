'use client';
import { StyledLink } from '@/components/StyledComponents/Link.styled';
import { MFAChannel } from '../Types/MFAEnums';
import { useMFAModalContext } from '../Context/MFAModalContext';

export interface ResendCodeLinkProps {
  resendCodeClick: () => void;
}

export const ResendCodeLink: React.FC<ResendCodeLinkProps> = ({ resendCodeClick }) => {
  const { contentDefinition, channel } = useMFAModalContext();

  return (
    <StyledLink href='' onClick={resendCodeClick}>
      {channel === MFAChannel.sms
        ? contentDefinition?.smsResendCodeButtonText
        : contentDefinition?.phoneResendCodeButtonText}
    </StyledLink>
  );
};

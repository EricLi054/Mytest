"use client";

import { NotAuthenticatedStateFlow } from "#composites/OneTimePassword/types/internal";
import { StyledLink } from "#styled/StyledLink";
import { createId } from "#utils/internal/index";

import { useOtpFlowState } from "../../contexts/OtpFlowState";
import { fireMfaOtpEvent } from "../../utils/index";

const linkText = "Send code via SMS";

export type SendCodeViaSmsLinkProps = {
  idPrefix: string;
  clearOtpInput?: () => void;
};

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const SendCodeViaSmsLink = ({ idPrefix, clearOtpInput }: SendCodeViaSmsLinkProps) => {
  const { flowState, setFlowState } = useOtpFlowState();
  return (
    <StyledLink
      id={createId(idPrefix, "send-code-via-sms-link")}
      role="link"
      rel="noopener noreferrer"
      noWrap
      onClick={() => {
        if (clearOtpInput) {
          clearOtpInput();
        }
        fireMfaOtpEvent({
          description: linkText,
          selectionStatus: flowState.selectionStatus,
          memberStatus: flowState.memberStatus,
        });
        setFlowState({
          ...flowState,
          selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
        });
      }}
    >
      {linkText}
    </StyledLink>
  );
};

export default SendCodeViaSmsLink;

"use client";

import { NotAuthenticatedStateFlow } from "#composites/OneTimePassword/types/internal";
import { StyledLink } from "#styled/StyledLink";
import { createId } from "#utils/internal/index";

import { useOtpFlowState } from "../../contexts/OtpFlowState";
import { fireMfaOtpEvent } from "../../utils";

const linkText = "Get code via phone call";

export type GetCodeViaPhoneCallLinkProps = {
  idPrefix: string;
  clearOtpInput?: () => void;
};

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const GetCodeViaPhoneCallLink = ({ idPrefix, clearOtpInput }: GetCodeViaPhoneCallLinkProps) => {
  const { flowState, setFlowState } = useOtpFlowState();
  return (
    <StyledLink
      id={createId(idPrefix, "get-code-via-phone-call-link")}
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
          selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
        });
      }}
    >
      {linkText}
    </StyledLink>
  );
};

export default GetCodeViaPhoneCallLink;

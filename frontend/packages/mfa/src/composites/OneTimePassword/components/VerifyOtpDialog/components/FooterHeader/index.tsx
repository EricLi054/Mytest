"use client";

import { Grid2 } from "@mui/material";
import { useOtpFlowState } from "#composites/OneTimePassword/contexts/OtpFlowState/index";
import { NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";
import { fireMfaOtpEvent } from "#composites/OneTimePassword/utils";
import { StyledLink } from "#styled/StyledLink";
import { createId } from "#utils/internal/index";

import GetCodeViaPhoneCallLink from "../../../GetCodeViaPhoneCallLink";
import SendCodeViaSmsLink from "../../../SendCodeViaSmsLink";

const idPrefix = "verify-otp-dialog";
const sendNewCodeLinkText = "Send new code";
const getAnotherPhoneCallLinkText = "Get another phone call";

export type FooterHeaderProps = {
  clearOtpInput: () => void;
};

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const FooterHeader = ({ clearOtpInput }: FooterHeaderProps) => {
  const { flowState, setFlowState } = useOtpFlowState();
  const isSms = flowState.selectionStatus === NotAuthenticatedStateFlow.ReadyToVerifyWithSMS;
  const isCall = flowState.selectionStatus === NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall;

  return !isSms && !isCall ? null : (
    <>
      {isSms && (
        <Grid2 size={{ xs: 12 }}>
          <StyledLink
            id={createId(idPrefix, "send-new-code-link")}
            role="link"
            rel="noopener noreferrer"
            noWrap
            onClick={() => {
              clearOtpInput();
              fireMfaOtpEvent({
                description: sendNewCodeLinkText,
                selectionStatus: flowState.selectionStatus,
                memberStatus: flowState.memberStatus,
              });
              setFlowState({
                ...flowState,
                selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
              });
            }}
          >
            {sendNewCodeLinkText}
          </StyledLink>
        </Grid2>
      )}

      {isSms &&
        (flowState.memberStatus === VerifyOptions.HasMobile ||
          flowState.memberStatus === VerifyOptions.HasLandline) && (
          <Grid2 size={{ xs: 12 }} sx={{ mt: 1 }}>
            <GetCodeViaPhoneCallLink idPrefix={idPrefix} clearOtpInput={clearOtpInput} />
          </Grid2>
        )}

      {isCall && (
        <Grid2 size={{ xs: 12 }}>
          <StyledLink
            id={createId(idPrefix, "get-another-phone-call-link")}
            role="link"
            rel="noopener noreferrer"
            noWrap
            onClick={() => {
              clearOtpInput();
              fireMfaOtpEvent({
                description: getAnotherPhoneCallLinkText,
                selectionStatus: flowState.selectionStatus,
                memberStatus: flowState.memberStatus,
              });
              setFlowState({
                ...flowState,
                selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
              });
            }}
          >
            {getAnotherPhoneCallLinkText}
          </StyledLink>
        </Grid2>
      )}

      {isCall && flowState.memberStatus === VerifyOptions.HasMobile && (
        <Grid2 size={{ xs: 12 }} sx={{ mt: 1 }}>
          <SendCodeViaSmsLink idPrefix={idPrefix} clearOtpInput={clearOtpInput} />
        </Grid2>
      )}
    </>
  );
};

export default FooterHeader;

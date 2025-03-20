"use client";

import type { NotAuthenticatedStateFlowValue, VerifyOptionsValue } from "#composites/OneTimePassword/types/internal";
import { Box, Grid2, Typography } from "@mui/material";
import { PhoneLink } from "#components/PhoneLink/index";
import { StyledLink } from "#styled/StyledLink";
import { createId } from "#utils/internal/index";

import { DEFAULT_RAC_PHONE_NUMBER } from "../../constants";
import { fireMfaOtpEvent, mfaOtpEvent } from "../../utils";

const needHelpFaqLinkText = "Visit our FAQs";

export type DialogFooterProps = {
  dialogId: string;
  faqUrl: string;
  /** The 'need help' RAC phone number in display format */
  helpDisplayPhoneNumber?: string;
  memberStatus: VerifyOptionsValue;
  selectionStatus: NotAuthenticatedStateFlowValue;
  header?: React.ReactNode;
};

/** TODO - DED-1295 - Should this be a function rather than a const? */
export const DialogFooter = ({
  dialogId,
  faqUrl,
  helpDisplayPhoneNumber,
  memberStatus,
  selectionStatus,
  header,
}: DialogFooterProps) => {
  const id = createId(dialogId, "footer");
  const needHelpFaqIdPrefix = createId(id, "need-help-faq");
  const notYourNumberCallIdPrefix = createId(id, "not-your-number-call-phone-number");
  if (!helpDisplayPhoneNumber?.trim()) {
    helpDisplayPhoneNumber = DEFAULT_RAC_PHONE_NUMBER;
  }
  return (
    <Box id={id}>
      {header && header}
      <Grid2 size={{ xs: 12 }} sx={{ mt: header ? 1 : 0 }}>
        <Typography variant="body2" id={createId(needHelpFaqIdPrefix, "label")}>
          Need help?{" "}
          <StyledLink
            id={createId(needHelpFaqIdPrefix, "link")}
            role="link"
            href={faqUrl}
            target="_blank"
            rel="noreferrer"
            noWrap
            onClick={() => fireMfaOtpEvent({ description: needHelpFaqLinkText, selectionStatus, memberStatus })}
          >
            {needHelpFaqLinkText}
          </StyledLink>
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 12 }} sx={{ mt: 1 }}>
        <Typography variant="body2" id={createId(notYourNumberCallIdPrefix, "label")}>
          Not your number? Call{" "}
          <PhoneLink
            id={createId(notYourNumberCallIdPrefix, "link")}
            displayNumber={helpDisplayPhoneNumber}
            analyticsEvent={mfaOtpEvent({
              description: `Call ${helpDisplayPhoneNumber}`,
              selectionStatus,
              memberStatus,
            })}
          />
        </Typography>
      </Grid2>
    </Box>
  );
};

export default DialogFooter;

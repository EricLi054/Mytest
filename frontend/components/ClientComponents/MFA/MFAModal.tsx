'use client';
import { Grid, styled } from '@mui/material';
import { RacwaDetailedDialog } from '@racwa/react-components';
import { useMFAModalContext } from './Context/MFAModalContext';
import { MFAState } from './Types/MFAEnums';
import { MFAVerifyItsYouModalContent } from './Content/MFAVerifyItsYouModalContent';
import { MFAModalFooter } from './Content/MFAModalFooter';
import { MFAEnterVerificationCodeModalContent } from './Content/MFAEnterVerificationCodeModalContent';

const StyledMFAModal = styled(RacwaDetailedDialog)(() => ({
  h2: {
    fontSize: 26
  }
}));

export const MFAModal: React.FC = () => {
  const {
    mfaState,
    mfaVerificationState,
    contentDefinition,
    isMFAModalOpen,
    handleMFAModalCancelled,
    handleMFASendCodeClick,
    handleMFAVerifyCodeClick,
    handleMFAChangeChannel,
    handleMFAResendCodeClick
  } = useMFAModalContext();

  return (
    <StyledMFAModal
      id='mfa-modal'
      open={isMFAModalOpen}
      onClose={handleMFAModalCancelled}
      onClickClose={handleMFAModalCancelled}
      title={
        mfaState === MFAState.requestCode
          ? contentDefinition.requestCodeModalTitle
          : contentDefinition.verifyCodeModalTitle
      }
      titleId='mfa-modal-title'
      titleVariant='h2'
      data-testid='mfa-modal'
    >
      <Grid container direction='column' gap={3}>
        <>
          {mfaState === MFAState.requestCode && (
            <>
              <MFAVerifyItsYouModalContent sendCodeClick={handleMFASendCodeClick} />
              <MFAModalFooter
                handleMFAChangeChannel={handleMFAChangeChannel}
                handleMFAResendCodeClick={handleMFAResendCodeClick}
              />
            </>
          )}
          {mfaState === MFAState.verifyCode && (
            <MFAEnterVerificationCodeModalContent
              id='mfa-verify-code-modal'
              verifyCodeClick={handleMFAVerifyCodeClick}
              mfaVerificationState={mfaVerificationState}
              handleMFAChangeChannel={handleMFAChangeChannel}
              handleMFAResendCodeClick={handleMFAResendCodeClick}
            />
          )}
        </>
      </Grid>
    </StyledMFAModal>
  );
};

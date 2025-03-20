"use client";

import type { OtpVerificationDetails, UseOneTimePasswordProps } from "#composites/OneTimePassword/types";
import type {
  OneTimePasswordErrorStateValue,
  OneTimePasswordFormValues,
} from "#composites/OneTimePassword/types/internal";
import type { BackdropState } from "#types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  OTP_INPUT_ERROR_MESSAGE,
  OTP_VERIFY_CLOSURE_DELAY,
  OTP_VERIFY_FORM_ID,
} from "#composites/OneTimePassword/constants";
import { verifyOtpSchema } from "#composites/OneTimePassword/schema";
import { OtpChannel } from "#composites/OneTimePassword/types";
import {
  NotAuthenticatedStateFlow,
  OneTimePasswordErrorState,
  VerifyOptions,
} from "#composites/OneTimePassword/types/internal";

import { useOtpFlowState } from "../../contexts/OtpFlowState";
import { fireMfaOtpEvent, getContactMethod, wait } from "../../utils";

export const useOneTimePassword = ({
  getVerificationDetails,
  checkAndSendOtp,
  checkAndVerifyOtp,
  onSuccess,
  onError,
  loadingModalMessage = "Loading",
}: UseOneTimePasswordProps) => {
  const isInitialized = useRef(false);
  const { flowState, setFlowState } = useOtpFlowState();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [justVerified, setJustVerified] = useState<boolean>(false);
  const [backdropState, setBackdropState] = useState<BackdropState>({ open: false });
  const [verificationDetails, setVerificationDetails] = useState<OtpVerificationDetails>();
  const [oneTimePasswordError, setOneTimePasswordError] = useState<OneTimePasswordErrorStateValue>(
    OneTimePasswordErrorState.None,
  );

  const [form, fields] = useForm<OneTimePasswordFormValues>({
    id: OTP_VERIFY_FORM_ID,
    shouldValidate: "onSubmit",
    shouldRevalidate: "onSubmit",
    onValidate: (context) => {
      const validation = parseWithZod(context.formData, { schema: verifyOtpSchema });
      if (validation.status === "error") {
        fireMfaOtpEvent({
          description: OTP_INPUT_ERROR_MESSAGE,
          selectionStatus: flowState.selectionStatus,
          memberStatus: flowState.memberStatus,
        });
      }
      return validation;
    },
  });

  const resetOneTimePasswordError = () => setOneTimePasswordError(OneTimePasswordErrorState.None);

  const fireUnhandledErrorMfaOtpEvent = (setDescriptionOnly = false) => {
    fireMfaOtpEvent({
      description: "Server error",
      selectionStatus: setDescriptionOnly ? undefined : flowState.selectionStatus,
      memberStatus: setDescriptionOnly ? undefined : flowState.memberStatus,
    });
  };

  const handleError = async () => {
    setFlowState({
      isAuthenticated: false,
      hasSendAttemptsRemaining: false,
      memberStatus: VerifyOptions.None,
      selectionStatus: NotAuthenticatedStateFlow.VerificationOptionNotSelected,
    });

    await onError();
  };

  useEffect(() => {
    const onLoad = async () => {
      try {
        setBackdropState({ open: true, message: loadingModalMessage });
        setIsSubmitting(true);
        resetOneTimePasswordError();

        const response = await getVerificationDetails();

        if (response.isAuthenticated) {
          // TODO - DED-1295 - Should be flowState be updated to indicate that the member is already authenticated?
          await onSuccess();
        } else if (!response.phoneNumberSuffix) {
          fireMfaOtpEvent({ description: "MC contact information missing" });
          // TODO - DED-1295 - Should this be handleError so that the flow state is set to the error state? Currently matches the RRL implementation
          await onError();
        } else {
          setFlowState({
            isAuthenticated: false,
            hasSendAttemptsRemaining: flowState.hasSendAttemptsRemaining,
            memberStatus: response.isMobile ? VerifyOptions.HasMobile : VerifyOptions.HasLandline,
            selectionStatus: response.isMobile
              ? NotAuthenticatedStateFlow.SMSVerificationOption
              : NotAuthenticatedStateFlow.PhoneCallVerificationOption,
          });
          setVerificationDetails(response);
        }
      } catch {
        fireUnhandledErrorMfaOtpEvent(true);
        await handleError();
      } finally {
        setIsSubmitting(false);
        setBackdropState({ open: false });
      }
    };

    if (!isInitialized.current) {
      void onLoad();
    }

    return () => {
      isInitialized.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Call the checkAndSendOtp function to receive an OTP code via SMS.
   *
   * This function will call either the CheckAndSendOtp or CheckAndSendRegistrationOtp
   * GQL mutation (based on whether the member is logged in or registering for myRAC)
   * which will call MFA Service CheckOtp then call MFA Service SendOtp GQL if the
   * member is not already authenticated for the unique MFA journey session key.
   */
  const onReceiveOtpViaSms = async () => {
    try {
      setBackdropState({ open: true, message: "Sending" });
      setIsSubmitting(true);
      resetOneTimePasswordError();

      if (!verificationDetails) {
        throw new Error(
          "onReceiveOtpViaSms: verificationDetails is undefined which indicates something went wrong loading the component.",
        );
      }

      const response = await checkAndSendOtp(verificationDetails.sessionKey, OtpChannel.SMS);

      if (response.errorCode === "TooManyRequestsError") {
        fireMfaOtpEvent({
          description: "OTP request maxed",
          selectionStatus: flowState.selectionStatus,
          memberStatus: flowState.memberStatus,
        });

        return await handleError();
      }

      if (!response.data) {
        throw new Error("onReceiveOtpViaSms: No data returned from checkAndSendOtp");
      }

      setFlowState({
        isAuthenticated: flowState.isAuthenticated,
        memberStatus: flowState.memberStatus,
        selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
        hasSendAttemptsRemaining: response.data.hasSendAttemptsRemaining,
      });
    } catch {
      fireUnhandledErrorMfaOtpEvent();
      await handleError();
    } finally {
      setIsSubmitting(false);
      setBackdropState({ open: false });
    }
  };

  /**
   * Call the checkAndSendOtp function to receive an OTP code via phone call.
   *
   * This function will call either the CheckAndSendOtp or CheckAndSendRegistrationOtp
   * GQL mutation (based on whether the member is logged in or registering for myRAC)
   * which will call MFA Service CheckOtp then call MFA Service SendOtp GQL if the
   * member is not already authenticated for the unique MFA journey session key.
   */
  const onReceiveOtpViaCall = async () => {
    try {
      setBackdropState({ open: true, message: "Triggering a phone call" });
      setIsSubmitting(true);
      resetOneTimePasswordError();

      if (!verificationDetails) {
        throw new Error(
          "onReceiveOtpViaCall: verificationDetails is undefined which indicates something went wrong loading the component.",
        );
      }

      const response = await checkAndSendOtp(verificationDetails.sessionKey, OtpChannel.CALL);

      if (response.errorCode === "TooManyRequestsError") {
        fireMfaOtpEvent({
          description: "OTP request maxed",
          selectionStatus: flowState.selectionStatus,
          memberStatus: flowState.memberStatus,
        });

        return await handleError();
      }

      if (!response.data) {
        throw new Error("onReceiveOtpViaCall: No data returned from checkAndSendOtp");
      }

      setFlowState({
        isAuthenticated: flowState.isAuthenticated,
        memberStatus: flowState.memberStatus,
        selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
        hasSendAttemptsRemaining: response.data.hasSendAttemptsRemaining,
      });
    } catch {
      fireUnhandledErrorMfaOtpEvent();
      await handleError();
    } finally {
      setIsSubmitting(false);
      setBackdropState({ open: false });
    }
  };

  /**
   * Call checkAndVerifyOtp function when onSubmit is
   * triggered to verify the OTP code entered by the member.
   *
   * This function will call either the CheckAndVerifyOtp or CheckAndVerifyRegistrationOtp
   * GQL mutation (based on whether the member is logged in or registering for myRAC)
   * which will call MFA Service CheckOtp then call MFA Service VerifyOtp GQL if the
   * member is not already authenticated for the unique MFA journey session key.
   *
   * TODO - DED-2215 - RACI MFA OTP Service performance issues identified on CheckOtp endpoint. Potentially remove the checkOtp call and just call verifyOtp.
   */
  const onSubmitVerifyOtp = async (values: OneTimePasswordFormValues) => {
    try {
      setBackdropState({ open: true, message: "Submitting" });
      setIsSubmitting(true);
      resetOneTimePasswordError();

      if (!verificationDetails) {
        throw new Error(
          "onSubmitVerifyOtp: verificationDetails is undefined which indicates something went wrong loading the component.",
        );
      }

      const response = await checkAndVerifyOtp(verificationDetails.sessionKey, values.verificationCode);

      if (response.errorCode === "TooManyRequestsError") {
        fireMfaOtpEvent({
          description: "OTP attempts maxed",
          selectionStatus: flowState.selectionStatus,
          memberStatus: flowState.memberStatus,
        });

        return await handleError();
      } else if (response.errorCode === "NotFoundError") {
        fireMfaOtpEvent({
          description: "OTP timeout",
          selectionStatus: flowState.selectionStatus,
          memberStatus: flowState.memberStatus,
        });
        return flowState.hasSendAttemptsRemaining
          ? setOneTimePasswordError(OneTimePasswordErrorState.CodeExpired)
          : await handleError();
      }

      if (!response.data) {
        throw new Error("onSubmitVerifyOtp: No data returned from checkAndVerifyOtp");
      }

      if (response.data.isVerified) {
        setJustVerified(true);
        resetOneTimePasswordError();

        await wait(OTP_VERIFY_CLOSURE_DELAY);

        const isSms =
          flowState.selectionStatus === NotAuthenticatedStateFlow.SMSVerificationOption ||
          flowState.selectionStatus === NotAuthenticatedStateFlow.ReadyToVerifyWithSMS;

        const contactMethod = getContactMethod({
          isSms,
          memberStatus: flowState.memberStatus,
        });

        fireMfaOtpEvent({ description: `${contactMethod} - Verified` });

        setFlowState({
          isAuthenticated: true,
          hasSendAttemptsRemaining: flowState.hasSendAttemptsRemaining,
          memberStatus: flowState.memberStatus,
          selectionStatus: flowState.selectionStatus,
        });

        await onSuccess();
      } else {
        setOneTimePasswordError(OneTimePasswordErrorState.WrongCode);
        fireMfaOtpEvent({
          description: "OTP incorrect",
          selectionStatus: flowState.selectionStatus,
          memberStatus: flowState.memberStatus,
        });
      }
    } catch {
      fireUnhandledErrorMfaOtpEvent();
      return await handleError();
    } finally {
      setIsSubmitting(false);
      setBackdropState({ open: false });
    }
  };

  return {
    form,
    fields,
    backdropState,
    phoneSuffix: verificationDetails?.phoneNumberSuffix ?? "",
    isSubmitting,
    justVerified,
    oneTimePasswordError,
    onReceiveOtpViaCall,
    onReceiveOtpViaSms,
    onSubmitVerifyOtp,
  };
};

export default useOneTimePassword;

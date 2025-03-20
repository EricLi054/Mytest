"use client";

import type {
  FlowStateContextValue,
  FlowValues,
  NotAuthenticatedStateFlowValue,
  VerifyOptionsValue,
} from "#composites/OneTimePassword/types/internal";
import type { PropsWithChildren } from "react";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";

const DefaultOtpFlowState: FlowValues = {
  isAuthenticated: false,
  hasSendAttemptsRemaining: true,
  memberStatus: VerifyOptions.HasMobile,
  selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
};

const FlowStateContext = React.createContext<FlowStateContextValue | undefined>(undefined);

/** TODO - DED-1295 - Should this be a function rather than a const? */
const OtpFlowStateProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(DefaultOtpFlowState.isAuthenticated);
  const [hasSendAttemptsRemaining, setHasSendAttemptsRemaining] = useState<boolean>(
    DefaultOtpFlowState.hasSendAttemptsRemaining,
  );
  const [memberStatus, setMemberStatus] = useState<VerifyOptionsValue>(DefaultOtpFlowState.memberStatus);
  const [selectionStatus, setSelectionStatus] = useState<NotAuthenticatedStateFlowValue>(
    DefaultOtpFlowState.selectionStatus,
  );

  const flowState = useMemo(
    () => ({ isAuthenticated, hasSendAttemptsRemaining, memberStatus, selectionStatus }),
    [isAuthenticated, hasSendAttemptsRemaining, memberStatus, selectionStatus],
  );

  const setFlowState = useCallback(
    ({ isAuthenticated, hasSendAttemptsRemaining, memberStatus, selectionStatus }: FlowValues) => {
      setIsAuthenticated(isAuthenticated);
      setSelectionStatus(selectionStatus);
      setMemberStatus(memberStatus);
      setHasSendAttemptsRemaining(hasSendAttemptsRemaining);
    },
    [],
  );

  return <FlowStateContext.Provider value={{ flowState, setFlowState }}>{children}</FlowStateContext.Provider>;
};

const useOtpFlowState = (): FlowStateContextValue => {
  const context = useContext(FlowStateContext);

  if (!context) {
    throw new Error("useOtpFlowState must be used within a OtpFlowStateProvider.");
  }

  return context;
};

export { OtpFlowStateProvider, useOtpFlowState };

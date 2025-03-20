import type { FormStatus, FormStatusNotPending, FormStatusPending } from "react-dom";
import { vi } from "vitest";

type MockFormStatus = ({ pending: true } & Partial<Omit<FormStatusPending, "pending">>) | { pending: false };

export const mockFormStatus = (status: MockFormStatus): FormStatus => {
  if (status.pending) {
    return {
      data: new FormData(),
      method: "POST",
      action: vi.fn(),
      ...status,
    } satisfies FormStatusPending;
  }
  return { data: null, method: null, action: null, ...status } satisfies FormStatusNotPending;
};

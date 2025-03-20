import type { SubmissionResult } from "@conform-to/react";

export const mockFormAction = () => {
  return Promise.resolve({} satisfies SubmissionResult<string[]>);
};

import { useEffect } from "react";
import { logEvent } from "#utils/analyticsTagging";

import type { ProductSystemKey } from "./types";

const gtmDescriptionMap = new Map<ProductSystemKey, string>([
  ["Finance", "Fin"],
  ["Shield", "Ins"],
  ["FinOps", "FinOps"],
]);

const useGTMLogSystemErrors = (systemsWithErrors: ProductSystemKey[]) => {
  useEffect(() => {
    if (systemsWithErrors.length === 0) return;

    const gtmErrorsString = systemsWithErrors
      .map((systemKey) => gtmDescriptionMap.get(systemKey) ?? "unknown")
      .sort((a, b) => a.localeCompare(b))
      .join(", ");

    logEvent(`System unavailable message - ${gtmErrorsString}`);
  }, [systemsWithErrors]);
};

export default useGTMLogSystemErrors;

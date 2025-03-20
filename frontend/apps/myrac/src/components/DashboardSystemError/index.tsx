"use client";

import { useMemo } from "react";
import { PartialResultsErrorSchema } from "#graphql/policyDetails/schema";

import type { GraphQLError, PartialResultsError, ProductSystemKey } from "./types";
import DashboardAlertNotification from "./index.styled";
import useGTMLogSystemErrors from "./useGTMLogSystemErrors";

export type DashboardSystemErrorProps = {
  errors?: GraphQLError[];
};
const DashboardSystemError: React.FC<DashboardSystemErrorProps> = ({ errors }) => {
  const systemsWithErrors = useMemo(() => getSystemKeysWithErrors(errors), [errors]);
  useGTMLogSystemErrors(systemsWithErrors);
  if (systemsWithErrors.length === 0) return null;

  return (
    <DashboardAlertNotification severity="warning" title="Sorry, we're having technical issues">
      <p>We may not be able to show all of your products and policies.</p>
      Please try again later.
    </DashboardAlertNotification>
  );
};

const mapToPartialResultsError = (e: GraphQLError) => {
  return PartialResultsErrorSchema.safeParse(e).success ? (e as PartialResultsError).extensions.systemKey : null;
};

const uniqueFilter = (value: ProductSystemKey, index: number, self: ProductSystemKey[]) => {
  return self.indexOf(value) === index;
};

const getSystemKeysWithErrors = (errors?: GraphQLError[]) =>
  errors
    ?.map(mapToPartialResultsError)
    .filter((e) => !!e)
    .filter(uniqueFilter) ?? [];

export default DashboardSystemError;

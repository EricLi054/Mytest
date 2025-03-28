"use client";

import type { Field } from "@data-driven-forms/react-form-renderer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormApi } from "@data-driven-forms/react-form-renderer";
import { getPerson } from "#graphql/person/queries";
import { useEnvironmentVariables } from "#providers/environmentVariables/context";
import { errorPages } from "#utils/errorPages";
import { MFASessionKey } from "#utils/mfaSessionKey";

import { EngineeredFormSkeleton } from "../EngineeredFormSkeleton";
import { getEditContactDetailsFormStep2Schema } from "./schema";

export const EditContactDetailsFormStep2 = () => {
  const [data, setData] = useState<Field[] | undefined>(undefined);
  const router = useRouter();
  const { renderForm } = useFormApi();
  const { B2C_URL } = useEnvironmentVariables();

  useEffect(() => {
    const getData = async () => {
      try {
        const person = await getPerson({ mfaSessionKey: MFASessionKey.ContactDetails });
        setData(getEditContactDetailsFormStep2Schema(person, B2C_URL));
      } catch {
        router.push(errorPages.somethingWentWrong);
      }
    };
    void getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data ? renderForm(data) : <EngineeredFormSkeleton />;
};

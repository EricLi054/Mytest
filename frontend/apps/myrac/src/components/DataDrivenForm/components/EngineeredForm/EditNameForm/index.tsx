"use client";

import type { Field } from "@data-driven-forms/react-form-renderer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormApi } from "@data-driven-forms/react-form-renderer";
import { getPerson } from "#graphql/person/queries";
import { errorPages } from "#utils/errorPages";
import { MFASessionKey } from "#utils/mfaSessionKey";

import { EngineeredFormSkeleton } from "../EngineeredFormSkeleton";
import { getEditNameFormStep2Schema } from "./schema";

export const EditNameFormStep2 = () => {
  const [data, setData] = useState<Field[] | undefined>(undefined);
  const router = useRouter();
  const { renderForm } = useFormApi();

  useEffect(() => {
    const getData = async () => {
      try {
        const person = await getPerson({ mfaSessionKey: MFASessionKey.ContactDetails });
        setData(getEditNameFormStep2Schema(person));
      } catch {
        router.push(errorPages.somethingWentWrong);
      }
    };
    void getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data ? renderForm(data) : <EngineeredFormSkeleton />;
};

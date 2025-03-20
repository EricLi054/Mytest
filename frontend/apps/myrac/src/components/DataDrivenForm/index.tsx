import { getPerson } from "#graphql/person/queries";
import { MFASessionKey } from "#utils/mfaSessionKey";
import { getServerSession } from "next-auth";

import { getDataDrivenFormData } from "./data";
import InternalDataDrivenForm from "./InternalDataDrivenForm";

export default async function DataDrivenForm({ id }: { id: string }) {
  const formSchema = await getDataDrivenFormData(id);

  // Only need person on the multi-step forms so reducing unnecessary calls to the API
  let person = undefined;
  const formPages = formSchema.fields[0] ? (formSchema.fields[0].fields as []) : [];
  if (formPages.length > 1) {
    person = await getPerson({ mfaSessionKey: MFASessionKey.ContactDetails });
  }
  const session = await getServerSession();
  const loginEmail = session?.user?.email ?? "";

  return <InternalDataDrivenForm schema={formSchema} data={{ person, loginEmail }} />;
}

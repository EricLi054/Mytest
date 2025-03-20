import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";
import { getPerson } from "#graphql/person/queries";

import { getHeaderData } from "./data";
import InternalHeader from "./InternalHeader";
import { createBreadcrumbs } from "./util";

export default async function Header({
  id,
  breadcrumbs,
  title,
}: {
  id: string;
  breadcrumbs?: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>;
  title: string;
}) {
  const header = await getHeaderData(id);
  const person = await getPerson();

  return (
    <InternalHeader
      headerData={header}
      breadcrumbs={header.showBreadcrumbs ? createBreadcrumbs(title, breadcrumbs) : undefined}
      person={person}
    />
  );
}

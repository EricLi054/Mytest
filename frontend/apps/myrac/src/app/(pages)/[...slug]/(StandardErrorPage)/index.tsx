import type { ErrorPageSchema } from "#graphql/sharedSchema/pageSchema";
import type { z } from "zod";
import { GenericErrorComponent } from "#components/Error/GenericErrorComponent";
import ContentfulRichTextRenderer from "#components/RichText/ContentfulRichTextRenderer";
import { GTMPageView } from "#components/shared/GTMPageView";

export default function StandardErrorPage({ pageData }: Readonly<{ pageData: z.infer<typeof ErrorPageSchema> }>) {
  const { heading, subHeading, content } = pageData;

  return (
    <>
      <GTMPageView />
      <GenericErrorComponent heading={heading ?? undefined} subHeading={subHeading ?? undefined}>
        <ContentfulRichTextRenderer text={content} />
      </GenericErrorComponent>
    </>
  );
}

import { RacwaLoadingModal } from '@racwa/react-components';
import { GenericErrorComponent } from '@/components/ClientComponents/GenericErrorComponent';
import ContentfulRichTextRenderer from '@/components/ServerComponents/ContentfulRichTextRenderer';

export default async function StandardErrorPage({ pageData }: Readonly<{ pageData: any | undefined }>) {
  if (!pageData) return <RacwaLoadingModal open={true} />;

  return (
    <>
      <GenericErrorComponent heading={pageData.heading ?? undefined} subHeading={pageData.subHeading ?? undefined}>
        {pageData.content && <ContentfulRichTextRenderer text={pageData.content} />}
      </GenericErrorComponent>
    </>
  );
}

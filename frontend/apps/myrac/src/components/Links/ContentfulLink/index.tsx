import { getLinkData } from "./data";
import { InternalContentfulLink } from "./InternalContentfulLink";

export default async function ContentfulLink({ id }: { id: string }) {
  const { longLinkText, linkUrl } = await getLinkData(id);

  return <InternalContentfulLink longLinkText={longLinkText} linkUrl={linkUrl} />;
}

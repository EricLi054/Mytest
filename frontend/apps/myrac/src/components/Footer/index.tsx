import ContentfulRichTextRenderer from "../RichText/ContentfulRichTextRenderer";
import { getFooterData } from "./data";
import InternalFooter from "./InternalFooter";
import { generateSitemap } from "./util";

export default async function Footer({ id }: { id: string }) {
  const footer = await getFooterData(id);
  return (
    <InternalFooter
      logo={footer.logo.length > 0 ? footer.logo[0].secureUrl : ""}
      searchPlaceholderText={footer.searchBar.placeholderText}
      sitemapData={generateSitemap(footer.sitemap.items)}
      links={footer.links.items}
      socialLinks={footer.socialLinks.items}
      footerDescription={<ContentfulRichTextRenderer text={footer.endText} />}
    />
  );
}

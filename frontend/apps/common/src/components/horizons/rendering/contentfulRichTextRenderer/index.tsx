import type { Document, Node } from "@contentful/rich-text-types";
import type { TypographyVariant } from "@mui/material";
import type { ContentfulRichTextRendererProps } from "#types/common/contentfulRichTextRendererProps";
import type { Entry } from "#types/common/richTextEntry";
import type { Links } from "#types/common/richTextLinks";
import type { Category } from "#types/horizons/category";
import type { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

import Button from "../../cms/button";
import CallToAction from "../../cms/callToAction";
import CloudinaryAsset from "../../cms/cloudinaryAsset";
import ContentRelatedArticle from "../../cms/contentRelatedArticle";
import InstagramPost from "../../cms/instagramPost";
import YoutubeEmbed from "../../cms/youtubeEmbed";
import AccentBorder from "../accentBorder";

function renderOptions(
  links: Links | undefined,
  isArticlePage: boolean,
  category: Category,
  typographyVariant: TypographyVariant,
  relatedArticleVariant: "simple" | "advanced",
) {
  const entryMap = new Map<string, Entry>();
  if (links?.entries !== undefined) {
    for (const entry of links.entries.inline) {
      entryMap.set(entry.sys.id, entry);
    }
    for (const entry of links.entries.block) {
      entryMap.set(entry.sys.id, entry);
    }
  }

  return {
    renderNode: {
      [BLOCKS.HEADING_1]: (node: Node, children: ReactNode) => (
        <Typography component="h1" variant="h1">
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_2]: (node: Node, children: ReactNode) => (
        <Typography component="h2" variant="h2" position="relative">
          {isArticlePage && <AccentBorder category={category} />}
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_3]: (node: Node, children: ReactNode) => (
        <Typography component="h3" variant="h3">
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_4]: (node: Node, children: ReactNode) => (
        <Typography component="h4" variant="h4">
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_5]: (node: Node, children: ReactNode) => (
        <Typography component="h5" variant="h5">
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_6]: (node: Node, children: ReactNode) => (
        <Typography component="h6" variant="h6" mt={0}>
          {children}
        </Typography>
      ),
      [BLOCKS.QUOTE]: (node: Node, children: ReactNode) => (
        <Typography variant="blockquote" component="blockquote">
          {children}
        </Typography>
      ),
      [BLOCKS.TABLE]: (node: Node, children: ReactNode) => (
        <TableContainer
          component={Paper}
          sx={{
            overflowX: "auto",
            marginBottom: 4,
            boxShadow: 1,
          }}
        >
          <Table
            sx={{
              "& td, & th": {
                border: "1px solid rgba(224, 224, 224, 1)",
                textAlign: "left",
              },
              "& p": {
                mb: 0,
              },
            }}
          >
            <TableBody>{children}</TableBody>
          </Table>
        </TableContainer>
      ),
      [BLOCKS.TABLE_ROW]: (node: Node, children: ReactNode) => (
        <TableRow
          sx={{
            "&:nth-of-type(odd)": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {children}
        </TableRow>
      ),
      [BLOCKS.TABLE_CELL]: (node: Node, children: ReactNode) => <TableCell>{children}</TableCell>,
      [BLOCKS.TABLE_HEADER_CELL]: (node: Node, children: ReactNode) => (
        <TableCell
          sx={{
            fontWeight: 600,
            backgroundColor: "primary.main",
            color: "#FFFFFF",
          }}
        >
          {children}
        </TableCell>
      ),
      [BLOCKS.PARAGRAPH]: (node: Node, children: ReactNode) => {
        if (Array.isArray(children)) {
          const processedChildren = children.map((child: string, childIndex) => {
            if (typeof child === "string") {
              return child.split("\n").map((line, lineIndex) => (
                <React.Fragment key={`${childIndex}-${lineIndex}`}>
                  {lineIndex > 0 && <br />}
                  {line}
                </React.Fragment>
              ));
            }
            return child;
          });

          return (
            <Typography
              variant={isArticlePage ? "bodyArticle" : typographyVariant}
              component="p"
              mb={isArticlePage ? 2 : 0}
              mt={0}
            >
              {processedChildren}
            </Typography>
          );
        }

        return (
          <Typography
            variant={isArticlePage ? "bodyArticle" : typographyVariant}
            component="p"
            mb={isArticlePage ? 2 : 0}
            mt={0}
          >
            {children}
          </Typography>
        );
      },
      [INLINES.EMBEDDED_ENTRY]: (node: Node) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const id = node.data.target?.sys?.id as string;
        const entry = entryMap.get(id);
        const sysId = { sys: { id } };

        switch (entry?.__typename) {
          case "horizons_CloudinaryAsset":
            return <CloudinaryAsset data={sysId} />;
          default:
            return "";
        }
      },
      [INLINES.HYPERLINK]: (node: Node, children: ReactNode) => {
        const href = node.data.uri as string;
        return <Link href={href}>{children}</Link>;
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node: Node) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const id = node.data.target?.sys?.id as string;
        const entry = entryMap.get(id);
        const sysId = { sys: { id } };

        switch (entry?.__typename) {
          case "horizons_CallToAction":
            return <CallToAction data={sysId} />;
          case "horizons_CloudinaryAsset":
            return <CloudinaryAsset data={sysId} />;
          case "horizons_YoutubeEmbed":
            return <YoutubeEmbed data={sysId} />;
          case "horizons_InstagramPostEmbed":
            return <InstagramPost data={sysId} />;
          case "horizons_Article":
            return <ContentRelatedArticle data={sysId} relatedArticleRendering={relatedArticleVariant} />;
          case "horizons_Button":
            return <Button data={sysId} />;
          default:
            return "";
        }
      },
    },
  };
}

function ContentfulRichTextRenderer({
  text,
  isArticlePage,
  category,
  typographyVariant,
  relatedArticleVariant,
}: ContentfulRichTextRendererProps) {
  const defaultDoc: Document = {
    nodeType: BLOCKS.DOCUMENT,
    content: [],
    data: {},
  };
  return (
    <>
      {documentToReactComponents(
        text?.json ?? defaultDoc,
        renderOptions(
          text?.links,
          isArticlePage ?? false,
          category ?? { name: "", slug: "", colour: "" },
          typographyVariant ?? "body1",
          relatedArticleVariant ?? "simple",
        ),
      )}
    </>
  );
}

export default ContentfulRichTextRenderer;

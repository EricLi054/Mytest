import type { Article } from "#types/horizons/article";
import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { calculateReadingTime } from "#utils/common/calculateReadingTime";

import type { CloudinaryImage } from "@racwa/ui";

import ArticleGrid from "../../layout/articleGrid";
import ArticleContent from "../articleContent";
import ArticleHero from "../articleHero";

type ArticleProps = {
  article: Article;
  relatedArticles: Article[];
  articleContent: ReactNode;
  articleContentPlainText: string;
};

const HorizonsArticle = ({ article, relatedArticles, articleContent, articleContentPlainText }: ArticleProps) => {
  const articleImage: CloudinaryImage[] = article.bannerImage.image;

  if (articleImage.length === 0 || articleImage[0] === undefined) {
    return null;
  }

  return (
    <Box component="article">
      <Box component="section">
        <ArticleHero
          heading={article.title}
          heroImage={articleImage[0].secure_url}
          alt={
            article.bannerImage.image_data?.[0]?.context?.custom?.alt ??
            article.bannerImage.image[0]?.context?.custom?.alt ??
            ""
          }
          leadParagraph={article.leadParagraph}
          readingTime={calculateReadingTime(article.content.json)}
          author={article.author}
          plainTextPageContent={articleContentPlainText}
          published={article.published ?? article.sys.firstPublishedAt ?? ""}
          lastUpdated={article.lastUpdated ?? ""}
          category={article.category}
          tags={article.contentfulMetadata?.tags}
          renderTags={article.renderTags}
        />
      </Box>
      <Box component="section">
        <ArticleContent
          content={articleContent}
          author={article.author}
          plainTextPageContent={articleContentPlainText}
          published={article.published ?? article.sys.firstPublishedAt ?? ""}
          lastUpdated={article.lastUpdated ?? ""}
          showArticleSummary={article.showArticleSummary}
        />
      </Box>
      {relatedArticles.length > 0 && (
        <Box component="section">
          <ArticleGrid
            articles={relatedArticles}
            category={article.category}
            heading="Related articles"
            cardType="Article"
            showCategoryOnCard={true}
            sectionColour="White"
          />
        </Box>
      )}
    </Box>
  );
};

export default HorizonsArticle;

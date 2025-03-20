import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import HorizonsArticle from ".";
import { TestArticle, TestCategory } from "../../../../testing/data/testData";
import ArticleContent from "../articleContent";
import ArticleHero from "../articleHero";

vi.mock("server-only", () => ({}));

describe("HorizonsArticle", () => {
  const mockSpeak = vi.fn();
  const mockCancel = vi.fn();
  const mockGetVoices = vi.fn(() => [
    { lang: "en-US", name: "Aria", default: true },
    { lang: "en-GB", name: "Daniel", default: false },
  ]);

  const mockSpeechSynthesisUtterance = vi.fn();

  beforeEach(() => {
    global.window.speechSynthesis = {
      getVoices: mockGetVoices,
      speak: mockSpeak,
      cancel: mockCancel,
    } as unknown as SpeechSynthesis;

    global.window.SpeechSynthesisUtterance = mockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
  });

  it("should be able to render HorizonsArticle", () => {
    const view = render(
      <HorizonsArticle
        article={TestArticle}
        relatedArticles={[
          {
            ...TestArticle,
          },
          {
            ...TestArticle,
          },
        ]}
        articleContent={<div>This is some article text</div>}
        articleContentPlainText="This is some article text"
      />,
    );

    expect(view).toBeDefined();
  });

  it("should be able to render ArticleHero", () => {
    const view = render(
      <ArticleHero
        heading={TestArticle.title}
        heroImage=""
        alt=""
        leadParagraph={TestArticle.leadParagraph}
        readingTime="1 min read"
        author={TestArticle.author}
        plainTextPageContent=""
        published="2021-01-01T00:00:00Z"
        lastUpdated="2021-01-01T00:00:00Z"
        category={TestCategory}
        renderTags={true}
      />,
    );

    expect(view).toBeDefined();
    expect(screen.getByText(TestArticle.title ?? "")).toBeInTheDocument();
  });

  it("should be able to render ArticleContent", () => {
    const view = render(
      <ArticleContent
        content={<div>This is some text from a paragraph</div>}
        author={TestArticle.author}
        plainTextPageContent="This is some text from a paragraph"
        published=""
        lastUpdated={TestArticle.lastUpdated ?? ""}
        showArticleSummary={TestArticle.showArticleSummary}
      />,
    );

    expect(view).toBeDefined();
    expect(screen.getByText("This is some text from a paragraph")).toBeInTheDocument();
  });
});

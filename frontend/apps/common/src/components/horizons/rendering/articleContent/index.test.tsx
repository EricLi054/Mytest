import { render, screen } from "@testing-library/react";
import { TestBio } from "#testing/data/testData";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ArticleContent from ".";

vi.mock("server-only", () => ({}));

describe("ArticleContent", () => {
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

  it("should be able to render", () => {
    render(
      <ArticleContent
        content={<div>Test page content</div>}
        author={{ name: "Author Name", profilePicture: [], bio: TestBio }}
        plainTextPageContent="Test page content"
        published="2021-10-01T00:00:00.000Z"
        lastUpdated="2021-10-01T00:00:00.000Z"
        showArticleSummary={false}
      />,
    );

    expect(screen.getByText("Test page content")).toBeVisible();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ListenToArticle from ".";

describe("ListenToArticle", () => {
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

  it("should render the component", () => {
    render(
      <ListenToArticle plainTextPageContent="This is test article content that the speech-to-text will read aloud" />,
    );

    expect(screen.getByLabelText("headphones")).toBeVisible();
  });

  it("should call speech synthesis when the button is clicked", async () => {
    render(
      <ListenToArticle plainTextPageContent="This is test article content that the speech-to-text will read aloud" />,
    );

    const button = screen.getByLabelText("headphones");
    await userEvent.click(button);

    expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(
      "This is test article content that the speech-to-text will read aloud",
    );
    expect(mockSpeak).toHaveBeenCalled();
  });

  it("should stop speech synthesis when clicked again", async () => {
    render(
      <ListenToArticle plainTextPageContent="This is test article content that the speech-to-text will read aloud" />,
    );

    const button = screen.getByLabelText("headphones");
    await userEvent.click(button);
    await userEvent.click(button);

    expect(mockCancel).toHaveBeenCalled();
  });
});

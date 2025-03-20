import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import VideoCarouselCard from ".";
import { TestCategory, TestYouTubeVideo } from "../../../../testing/data/testData";

describe("VideoCarouselCard", () => {
  it("should render and display an image and heading", () => {
    render(<VideoCarouselCard video={TestYouTubeVideo} category={TestCategory} />);

    expect(screen.getByRole("img")).toBeVisible();
    expect(screen.getByRole("heading")).toBeVisible();
  });

  it("should open video modal when clicked and display the video title", async () => {
    render(<VideoCarouselCard video={TestYouTubeVideo} category={TestCategory} />);

    const videoTrigger = screen.getByRole("button");
    await userEvent.click(videoTrigger);

    const iframe = await screen.findByTitle(TestYouTubeVideo.title);

    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", TestYouTubeVideo.url);
  });

  it("should close the video modal when clicking the backdrop", async () => {
    render(<VideoCarouselCard video={TestYouTubeVideo} category={TestCategory} />);

    await userEvent.click(screen.getByRole("button"));

    await userEvent.click(screen.getByTestId("video-backdrop"));

    expect(screen.queryByTitle(TestYouTubeVideo.title)).not.toBeInTheDocument();
  });
});

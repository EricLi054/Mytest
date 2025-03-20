import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulVideoCarousel, VideoCarouselProps } from "#types/horizons/videoCarousel";
import { Box } from "@mui/material";

import VideoCarouselLayoutRendering from "../../layout/videoCarousel";
import { getVideoCarousel } from "./data";
import { styles } from "./styles";

const fetchVideoCarousel = async (id: string) => {
  try {
    const data = await getVideoCarousel(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function VideoCarousel(props: ComponentProps) {
  const { data } = props;
  const videoCarouselContentfulEntry: ContentfulVideoCarousel = (await fetchVideoCarousel(
    data.sys.id,
  )) as ContentfulVideoCarousel;

  if (!videoCarouselContentfulEntry) {
    return <></>;
  }

  const videoCarousel: VideoCarouselProps = videoCarouselContentfulEntry.data.horizons_videoCarousel;

  return (
    <Box component="section" sx={styles.videoCarouselSection(videoCarousel.sectionColour)}>
      <VideoCarouselLayoutRendering
        heading={videoCarousel.heading}
        category={videoCarousel.category}
        videos={videoCarousel.videosCollection?.items ?? []}
        seeMoreButtonText={videoCarousel.seeMoreButtonText}
        seeMoreButtonUrl={videoCarousel.seeMoreButtonUrl}
      />
    </Box>
  );
}

export default VideoCarousel;

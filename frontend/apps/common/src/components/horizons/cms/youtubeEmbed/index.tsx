import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulYoutubeEmbed, YoutubeEmbedProps } from "#types/horizons/youtubeEmbed";
import { Box } from "@mui/material";

import { getYoutubeEmbed } from "./data";
import { styles } from "./styles";

const fetchYoutubeEmbed = async (id: string) => {
  try {
    const data = await getYoutubeEmbed(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function YoutubeEmbed(props: ComponentProps) {
  const { data } = props;
  const youtubeEmbedContentfulEntry: ContentfulYoutubeEmbed = (await fetchYoutubeEmbed(
    data.sys.id,
  )) as ContentfulYoutubeEmbed;

  if (!youtubeEmbedContentfulEntry) {
    return <></>;
  }

  const youtubeEmbed: YoutubeEmbedProps = youtubeEmbedContentfulEntry.data.horizons_youtubeEmbed;

  return (
    <Box sx={styles.youtubeVideoWrapper}>
      <Box
        component="iframe"
        width="100%"
        height="100%"
        src={youtubeEmbed.url}
        title={youtubeEmbed.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sx={styles.youtubeVideo}
      />
    </Box>
  );
}

export default YoutubeEmbed;

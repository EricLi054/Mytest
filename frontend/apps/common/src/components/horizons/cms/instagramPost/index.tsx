import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulInstagramPost, InstagramPostEmbedProps } from "#types/horizons/instagramPost";

import { getInstagramPost } from "./data";
import InstagramPostRendering from "./instagramPost";

const fetchInstagramPost = async (id: string) => {
  try {
    const data = await getInstagramPost(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function InstagramPost(props: ComponentProps) {
  const { data } = props;
  const instagramPostContentfulEntry: ContentfulInstagramPost = (await fetchInstagramPost(
    data.sys.id,
  )) as ContentfulInstagramPost;

  if (!instagramPostContentfulEntry) {
    return <></>;
  }

  const instagramPost: InstagramPostEmbedProps = instagramPostContentfulEntry.data.horizons_instagramPostEmbed;

  return <InstagramPostRendering title={instagramPost.title} postUrl={instagramPost.postUrl} />;
}

export default InstagramPost;

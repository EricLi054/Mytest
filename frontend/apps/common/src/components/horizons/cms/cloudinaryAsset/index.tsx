import type { ComponentProps } from "#types/horizons/componentProps";
import NextLink from "next/link";
import { Box, Link } from "@mui/material";
import { GlobalStyles } from "#styles/globalStyles";

import type { CloudinaryAsset, CloudinaryImage, ContentfulCloudinaryAsset } from "@racwa/ui";
import { CldImage } from "@racwa/ui";

import ImageCaption from "./caption";
import { getCloudinaryAsset } from "./data";

const fetchCloudinaryAsset = async (id: string) => {
  try {
    const data = await getCloudinaryAsset(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function CloudinaryAsset(props: ComponentProps) {
  const { data } = props;
  const cloudinaryAssetContentfulEntry: ContentfulCloudinaryAsset = (await fetchCloudinaryAsset(
    data.sys.id,
  )) as ContentfulCloudinaryAsset;

  if (!cloudinaryAssetContentfulEntry) {
    return <></>;
  }

  const cloudinaryAsset: CloudinaryAsset = cloudinaryAssetContentfulEntry.data.horizons_cloudinaryAsset;
  const image: CloudinaryImage[] = cloudinaryAsset.image;

  if (image.length === 0 || image[0] === undefined) {
    return <></>;
  }

  const imageContent = (
    <>
      <Box component="figure" sx={GlobalStyles.noMargin}>
        <CldImage
          environmentPath="/rac-horizons"
          src={image[0].secure_url}
          alt={
            cloudinaryAsset.image_data?.[0]?.context?.custom?.alt ??
            cloudinaryAsset.image[0]?.context?.custom?.alt ??
            ""
          }
          width={image[0]?.width}
          height={image[0]?.height}
          title={
            cloudinaryAsset.image_data?.[0]?.context?.custom?.alt ??
            cloudinaryAsset.image[0]?.context?.custom?.alt ??
            ""
          }
          style={{
            width: cloudinaryAsset.fillContainerWidth ? "100%" : image[0]?.width,
            height: cloudinaryAsset.fillContainerWidth ? "auto" : image[0]?.height,
          }}
          quality="auto:eco"
        />
      </Box>
      {cloudinaryAsset.showCaption && (
        <ImageCaption
          captionText={
            cloudinaryAsset.image_data?.[0]?.context?.custom?.caption ??
            cloudinaryAsset.image[0]?.context?.custom?.caption ??
            ""
          }
        />
      )}
    </>
  );

  return (
    <Box
      sx={{
        display: cloudinaryAsset.fillContainerWidth ? "block" : "inline-block",
        mr: cloudinaryAsset.fillContainerWidth ? 0 : 2,
        mb: cloudinaryAsset.fillContainerWidth ? 4 : 2,
      }}
    >
      {cloudinaryAsset.link ? (
        <Link
          component={NextLink}
          href={cloudinaryAsset.link}
          target={cloudinaryAsset.openLinkInNewTab ? "_blank" : "_self"}
          rel={cloudinaryAsset.openLinkInNewTab ? "noopener noreferrer" : undefined}
          underline="none"
        >
          {imageContent}
        </Link>
      ) : (
        imageContent
      )}
    </Box>
  );
}

export default CloudinaryAsset;

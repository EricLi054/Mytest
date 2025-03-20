import type { CallToActionProps, ContentfulCallToAction } from "#types/horizons/callToAction";
import type { ComponentProps } from "#types/horizons/componentProps";
import NextLink from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { getPlainTextFromRichText } from "#utils/common/getPlainTextFromRichText";

import type { CloudinaryImage } from "@racwa/ui";
import { colors } from "@racwa/styles";

import { getCallToAction } from "./data";
import { styles } from "./styles";

const fetchCallToAction = async (id: string) => {
  try {
    const data = await getCallToAction(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function CallToAction(props: ComponentProps) {
  const { data } = props;
  const ctaContentfulEntry: ContentfulCallToAction = (await fetchCallToAction(data.sys.id)) as ContentfulCallToAction;

  if (!ctaContentfulEntry) {
    return <></>;
  }

  const cta: CallToActionProps = ctaContentfulEntry.data.horizons_callToAction;

  let ctaImageExists = false;

  const ctaImage: CloudinaryImage[] = cta.image?.image ?? [];

  if (ctaImage.length === 0 || ctaImage[0] === undefined) {
    ctaImageExists = false;
  } else {
    ctaImageExists = true;
  }

  return (
    <>
      <Box sx={{ ...styles.ctaWrapper, mt: { xs: ctaImageExists ? "30%" : 0, md: 0 } }} component="aside">
        {ctaImageExists && (
          <Box
            component="img"
            src={ctaImage[0]?.secure_url}
            alt={cta.image?.image_data?.[0]?.context?.custom?.alt ?? cta.image?.image[0]?.context?.custom?.alt ?? ""}
            sx={styles.ctaImage}
          />
        )}
        <Box
          sx={{
            ...styles.ctaContentWrapper,
            maxWidth: { xs: "100%", md: ctaImageExists ? "calc(100% - 150px)" : "100%" },
            marginLeft: { xs: 0, md: ctaImageExists ? "150px" : 0 },
          }}
        >
          <Typography variant="display3" component="h2" color={colors.dieselDeep} m={0}>
            {cta.title}
          </Typography>
          <Typography component="p" variant="body1" color={colors.dieselDeep} sx={{ mb: 2 }}>
            {getPlainTextFromRichText(cta.detailedDescription.json)}
          </Typography>
          <Button
            LinkComponent={NextLink}
            variant="contained"
            href={cta.link}
            sx={styles.ctaButton}
            className="dynamic-cta"
          >
            {cta.linkText}
          </Button>
        </Box>
      </Box>
      <Typography component="p" variant="finePrint" color={colors.dieselDeep} sx={{ mt: 2, mb: 4 }}>
        {cta.finePrint}
      </Typography>
    </>
  );
}

export default CallToAction;

import { Grid2 as Grid, Typography } from "@mui/material";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";

import { colors } from "@racwa/styles";

type MessageBannerProps = {
  text: string;
};

function MessageBanner({ text }: MessageBannerProps) {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      width="100%"
      height={50}
      sx={{ backgroundColor: colors.dieselDeep }}
    >
      <Typography variant="h4" color="white">
        <FontAwesomeIcon icon="phone" style={{ marginRight: 8 }} />
        {text}
      </Typography>
    </Grid>
  );
}

export default MessageBanner;

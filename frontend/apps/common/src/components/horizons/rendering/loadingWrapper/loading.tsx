import { Box, CircularProgress } from "@mui/material";

import { colors } from "@racwa/styles";

import { styles } from "./styles";

const LoadingRendering = () => {
  return (
    <Box sx={styles.loadingScreen}>
      <CircularProgress size={80} sx={{ color: colors.white }} disableShrink />
    </Box>
  );
};

export default LoadingRendering;

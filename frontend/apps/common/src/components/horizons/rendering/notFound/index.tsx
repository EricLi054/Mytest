import NextLink from "next/link";
import { Box, Button, Typography } from "@mui/material";

import { styles } from "./styles";

const NotFound = () => {
  return (
    <>
      <Box sx={styles.notFoundImage}>
        <Box sx={styles.notFoundContent}>
          <Typography variant="h1" mb={2}>
            You've ventured beyond the horizon
          </Typography>
          <Typography variant="body1" mb={4}>
            Either you've gone too far or we moved the page.
          </Typography>
          <Button
            LinkComponent={NextLink}
            variant="contained"
            color="primary"
            sx={styles.notFoundContentButton}
            href="/horizons"
          >
            Home
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default NotFound;

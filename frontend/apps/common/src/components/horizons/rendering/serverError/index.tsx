import NextLink from "next/link";
import { Box, Button, Typography } from "@mui/material";

import { styles } from "./styles";

const ServerError = () => {
  return (
    <>
      <Box sx={styles.serverErrorImage}>
        <Box sx={styles.serverErrorContent}>
          <Typography variant="h1" mb={2}>
            500 miles from anywhere
          </Typography>
          <Typography variant="body1" mb={4}>
            But we'll get you back home.
          </Typography>
          <Button
            LinkComponent={NextLink}
            variant="contained"
            color="primary"
            sx={styles.serverErrorContentButton}
            href="/horizons"
          >
            Home
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default ServerError;

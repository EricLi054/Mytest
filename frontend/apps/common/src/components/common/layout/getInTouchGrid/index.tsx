import type { ContactNumbers, ContactNumbersCollection } from "#types/common/contactMethodsSection";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import PhoneNumber from "../../phoneNumber";
import { styles } from "./styles";

type GetInTouchGridProps = {
  heading: string;
  contactNumbers: ContactNumbersCollection;
};

const GetInTouchGrid = ({ heading, contactNumbers }: GetInTouchGridProps) => {
  return (
    <>
      <Grid container spacing={3} direction="row">
        <Grid size={{ xs: 12, md: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h1" component="h1" sx={styles.contactMethodsHeader}>
              {heading}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3} direction="row">
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={styles.contactMethodsBox}>
                <Typography variant="h2" component="h2">
                  Phone
                </Typography>
              </Box>
            </Grid>
            {contactNumbers.items.map((contactNumbers: ContactNumbers) => (
              <PhoneNumber contactNumbers={contactNumbers} key={contactNumbers.businessAreaCovered} />
            ))}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={styles.contactMethodsBox}>
                <Typography variant="h2" component="h2">
                  Online
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="h5" component="h5" sx={styles.numberRegion}>
                  General Enquiries
                </Typography>
                <Typography variant="body1" sx={styles.phoneStyle}>
                  <Link href="/about-rac/contact-us/enquiry">Email</Link> us your enquiry or feedback any time you like.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="h5" component="h5" sx={styles.numberRegion}>
                  Feedback
                </Typography>
                <Typography variant="body1" sx={styles.phoneStyle}>
                  We welcome your feedback, so please
                  <Link href="/about-rac/contact-us/feedback"> let us know your experience.</Link>
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={styles.contactMethodsBox}>
                <Typography variant="h3" component="h3">
                  In Person
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box>
                <Typography variant="body1" sx={styles.phoneStyle}>
                  Check out our branches and service centres to see if there's one near you.
                </Typography>
                <Button
                  size="medium"
                  startIcon={<LocationOnIcon />}
                  sx={styles.branchBox}
                  href="/about-rac/contact-us/find-a-branch"
                >
                  Find an RAC branch
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default GetInTouchGrid;

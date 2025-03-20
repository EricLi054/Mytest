import type { ContactNumbers } from "#types/common/contactMethodsSection";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Phone from "@mui/icons-material/Phone";
import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { colors } from "@racwa/styles";

import { styles } from "./styles";

type PhoneNumberProps = {
  contactNumbers: ContactNumbers;
};

const PhoneNumber = ({ contactNumbers }: PhoneNumberProps) => {
  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box>
          {contactNumbers.businessAreaCovered == "General" && (
            <Typography variant="h5" component="h5" sx={styles.numberRegion}>
              Australia
            </Typography>
          )}
          {contactNumbers.businessAreaCovered == "International" && (
            <Typography variant="h5" component="h5" sx={styles.numberRegion}>
              International
            </Typography>
          )}
          <Typography variant="body1">
            <Phone color="secondary" sx={styles.phoneStyle} />
            <Link href={`tel:${contactNumbers.phoneNumber.replaceAll(" ", "")}`}>{contactNumbers.phoneNumber}</Link>
          </Typography>
          <Typography variant="body1">{contactNumbers.openingHours}</Typography>
          <Typography variant="body1">{contactNumbers.additionalOpeningHours}</Typography>
          {contactNumbers.businessAreaCovered == "General" && (
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{ p: 0 }}
              >
                <Typography variant="body2" color={colors.linkBlue} textAlign="left">
                  For deaf, hearing or speech impaired members
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <Typography variant="body2">
                  Contact us through the National Relay Service via
                  <Link href="https://www.relayservice.gov.au"> relayservice.gov.au</Link> stating that you want to
                  contact RAC on
                  <Link href="tel:131111"> 13 11 11.</Link>
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </Grid>
    </>
  );
};
export default PhoneNumber;

import type { WebCardDetails, WebCardsCollection } from "#types/common/webCardWrapper";
import Grid from "@mui/material/Grid2";

import WebCardFull from "../../webCardFull";

type WebCardFullWidthProps = {
  webCards: WebCardsCollection;
};

const WebCardFullWidth = ({ webCards }: WebCardFullWidthProps) => {
  return (
    <Grid container spacing={3} direction="row">
      {webCards.items.map((webCard: WebCardDetails) => (
        <WebCardFull webCardDetails={webCard} key={webCard.sys.id} />
      ))}
    </Grid>
  );
};

export default WebCardFullWidth;

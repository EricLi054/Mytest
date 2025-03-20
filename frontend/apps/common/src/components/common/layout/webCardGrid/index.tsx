import type { WebCardDetails, WebCardsCollection } from "#types/common/webCardWrapper";
import Grid from "@mui/material/Grid2";

import WebCard from "../../webCard";

type WebCardGridProps = {
  webCards: WebCardsCollection;
};

const WebCardGrid = ({ webCards }: WebCardGridProps) => {
  return (
    <Grid container spacing={3}>
      {webCards.items.map((webCard: WebCardDetails) => (
        <Grid size={{ xs: 12, md: 4 }} key={webCard.sys.id}>
          <WebCard webCardDetails={webCard} />
        </Grid>
      ))}
    </Grid>
  );
};

export default WebCardGrid;

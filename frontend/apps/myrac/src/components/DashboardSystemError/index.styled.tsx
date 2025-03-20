"use client";

import { styled } from "@mui/material";

import { RacwaCardNotification } from "@racwa/react-components";

const DashboardAlertNotification = styled(RacwaCardNotification)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    maxWidth: theme.spacing(120),
  },
}));

export default DashboardAlertNotification;

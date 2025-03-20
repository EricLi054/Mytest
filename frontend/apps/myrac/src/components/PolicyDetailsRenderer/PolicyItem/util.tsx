import type {
  BundledAmount,
  BundledProduct,
  PaymentFrequency,
  PaymentMethod,
} from "#components/PolicyDetailsRenderer/types";
import Link from "next/link";
import { Grid2 as Grid, Typography } from "@mui/material";

import { colors } from "@racwa/styles";

export const createBundledAmountMessage = (bundledAmount: BundledAmount) => {
  return (
    <>
      <Typography variant="body1" fontSize={"medium"} fontWeight={"medium"} gutterBottom>
        {bundledAmount.message}
      </Typography>
      {bundledAmount.bundledProducts && (
        <ul style={{ fontSize: "14px" }}>
          {bundledAmount.bundledProducts.map((bundledProduct: BundledProduct, index: number) => {
            return (
              <li key={index}>
                {bundledProduct.productName}
                <br />
                {bundledProduct.asset}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export const createPaymentFrequencyMessage = (paymentFrequency: PaymentFrequency) => {
  return (
    <Grid container direction="column" gap={1.5}>
      <Typography variant="body1" fontSize={"medium"} fontWeight={"medium"} gutterBottom>
        {paymentFrequency.message}
      </Typography>
      {paymentFrequency.link ? (
        <Link href={paymentFrequency.link} style={{ color: colors.linkBlue }}>
          <Typography variant="body1" fontSize={"medium"} fontWeight={"medium"}>
            {paymentFrequency.linkText}
          </Typography>
        </Link>
      ) : null}
    </Grid>
  );
};

export const createPaymentMethodMessage = (paymentMethod: PaymentMethod) => {
  return (
    <Grid container direction="column" gap={1.5}>
      {paymentMethod.bsb && (
        <Grid>
          <Typography variant="body1" fontSize={"medium"}>
            BSB
          </Typography>
          <Typography variant="body1" fontSize={"medium"} fontWeight={"medium"}>
            {paymentMethod.bsb}
          </Typography>
        </Grid>
      )}
      {paymentMethod.accountNumber && (
        <Grid>
          <Typography variant="body1" fontSize={"medium"}>
            Bank account no.
          </Typography>
          <Typography variant="body1" fontSize={"medium"} fontWeight={"medium"}>
            {paymentMethod.accountNumber}
          </Typography>
        </Grid>
      )}
      {paymentMethod.cardNumber && (
        <Grid>
          <Typography variant="body1" fontSize={"medium"}>
            Card number
          </Typography>
          <Typography variant="body1" fontSize={"medium"} fontWeight={"medium"}>
            {paymentMethod.cardNumber}
          </Typography>
        </Grid>
      )}
      {paymentMethod.cardExpiry && (
        <Grid>
          <Typography variant="body1" fontSize={"medium"}>
            Card expiry
          </Typography>
          <Typography variant="body1" fontSize={"medium"} fontWeight={"medium"}>
            {paymentMethod.cardExpiry}
          </Typography>
        </Grid>
      )}
      {paymentMethod.link ? (
        <Link href={paymentMethod.link} style={{ color: colors.linkBlue }}>
          <Typography variant="body1" fontSize={"medium"} fontWeight={"medium"}>
            {paymentMethod.linkText}
          </Typography>
        </Link>
      ) : null}
    </Grid>
  );
};

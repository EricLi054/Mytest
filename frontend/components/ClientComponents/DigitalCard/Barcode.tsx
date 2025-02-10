'use client';
import { styled } from '@mui/material';
import JsBarcode from 'jsbarcode';
import { useEffect } from 'react';

const StyledSvg = styled('svg')(({ theme }) => ({
  width: '100%',
  height: 'auto'
}));

export const BarcodeClient = ({ membershipCardNumber }: { membershipCardNumber: string }) => {
  useEffect(() => {
    if (!membershipCardNumber || membershipCardNumber.length !== 16) return;

    JsBarcode('#barcode', membershipCardNumber, {
      format: 'code128b',
      displayValue: false,
      lineColor: 'black',
      background: 'white'
    });
  }, [membershipCardNumber]);

  return <StyledSvg id='barcode' data-testid='barcode' />;
};

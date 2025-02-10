import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarcodeClient } from './Barcode';
import JsBarcode from 'jsbarcode';

jest.mock('jsbarcode');

describe('BarcodeClient', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the SVG element', () => {
    render(<BarcodeClient membershipCardNumber='1234567890123' />);
    const svgElement = screen.getByTestId('barcode');
    expect(svgElement).toBeInTheDocument();
  });

  it('calls JsBarcode with correct arguments when barcode length is 16', () => {
    const barcode = '1234567890123456';
    render(<BarcodeClient membershipCardNumber={barcode} />);
    expect(JsBarcode).toHaveBeenCalledWith('#barcode', barcode, {
      format: 'code128b',
      displayValue: false,
      lineColor: 'black',
      background: 'white'
    });
  });

  it('does not call JsBarcode when barcode length is not 13', () => {
    render(<BarcodeClient membershipCardNumber='123' />);
    expect(JsBarcode).not.toHaveBeenCalled();
  });
});

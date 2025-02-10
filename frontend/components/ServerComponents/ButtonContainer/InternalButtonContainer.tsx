import { StyledButtonContainer } from '@/components/StyledComponents/ButtonContainer.styled';
import { type Breakpoint, Grid } from '@mui/material';
import React, { type PropsWithChildren } from 'react';

interface InternalButtonContainerProps extends PropsWithChildren {
  stackTogether: boolean;
  itemsPerRow: number;
  largeWidth: number;
  columnBreakpoint: Breakpoint;
  gap: number;
}

function InternalButtonContainer({
  stackTogether,
  itemsPerRow,
  largeWidth,
  columnBreakpoint,
  gap,
  children
}: InternalButtonContainerProps) {
  return (
    <StyledButtonContainer
      container
      gap={{ xs: gap, [columnBreakpoint]: 0 }}
      rowSpacing={{ xs: 0, [columnBreakpoint]: gap }}
      columnSpacing={{ xs: 0, [columnBreakpoint]: gap }}
      maxWidth={largeWidth * 8}
      direction={{ xs: 'column', [columnBreakpoint]: 'row' }}
      stackTogether={stackTogether}
      columnBreakpoint={columnBreakpoint}
    >
      {React.Children.map(children, (child, index) => {
        return (
          <Grid
            item
            key={index}
            xs={12}
            sm={columnBreakpoint === 'sm' ? 12 / itemsPerRow : undefined}
            md={columnBreakpoint === 'md' ? 12 / itemsPerRow : undefined}
          >
            {child}
          </Grid>
        );
      })}
    </StyledButtonContainer>
  );
}

export default InternalButtonContainer;

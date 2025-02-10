'use client'

import { Grid, styled } from '@mui/material'

const StyledGridItem = styled(Grid)(() => ({
  height: 'fit-content',
  '&:empty': {
    display: 'none'
  }
}
))

export default StyledGridItem

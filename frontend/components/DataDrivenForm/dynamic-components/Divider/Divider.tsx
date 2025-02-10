'use client'
import { Divider, type Theme } from '@mui/material'
import { styled } from '@mui/material'

const StyledDivider = styled(Divider)(({ theme }: { theme: Theme }) => ({
  margin: `${theme.spacing(1)} 0`
}))

export const RacwaDivider = () => {
  return <StyledDivider />
}

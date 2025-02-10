'use client'
import { styled } from '@mui/material'
import { RacwaLoadingModal } from '@racwa/react-components'

export const StyledLoadingModal = styled(RacwaLoadingModal)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1
}))

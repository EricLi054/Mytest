'use client'

import FontAwesomeIcon from './FontAwesomeIcon'
import { Button, InputAdornment, OutlinedInput, styled } from '@mui/material'
import { colors } from '@racwa/styles'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const StyledSearchButton = styled(Button)(({ theme }) => ({
  width: theme.spacing(1),
  fontSize: 14,
  border: 0,
  minWidth: 0,
  height: 'auto',
  color: 'white',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent'
  }
}))

const StyledInputAdornment = styled(InputAdornment)(() => ({
  marginRight: '-14px'
}))

const StyledOutlinedInput = styled(OutlinedInput, { shouldForwardProp: prop => prop !== 'fullWidth' })<{ fullWidth: boolean }>(({ fullWidth }) => ({
  fontWeight: 400,
  fontSize: 14,
  color: 'white',
  backgroundColor: colors.dieselDeep,
  width: fullWidth ? '100%' : 150,
  height: '2rem',
  transition: 'all ease-in-out .15s',
  '&:hover': {
    color: colors.dieselDeep,
    backgroundColor: 'white',
    width: fullWidth ? '100%' : 250,
    '& button': {
      color: colors.linkBlue,
      '&:hover': {
        color: colors.racYellow
      }
    }
  },
  '& fieldset': {
    border: 0
  }
}))

interface HeaderSearchBarProps {
  placeholder: string
  fullWidth?: boolean
}

function HeaderSearchBar({ placeholder, fullWidth = false }: HeaderSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const onSearch = () => {
    if (searchTerm) {
      router.push(`/search#/searchresult?query=${searchTerm}`)
    }
  }

  return (
      <StyledOutlinedInput placeholder={placeholder}
                           onChange={(e) => { setSearchTerm(e.target.value) }}
                           endAdornment={
                            <StyledInputAdornment position='end'>
                                <StyledSearchButton onClick={onSearch}>
                                    <FontAwesomeIcon icon='search' />
                                </StyledSearchButton>
                            </StyledInputAdornment>
                           }
                           fullWidth={fullWidth}/>
  )
}

export default HeaderSearchBar

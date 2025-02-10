'use client'
import { logFieldTouched } from '@/utilities/analyticsTagging'
import { useFieldApi } from '@data-driven-forms/react-form-renderer'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Grid, Typography, styled, useMediaQuery } from '@mui/material'
import { theme } from '@racwa/react-components'

const StyledEditButton = styled(Button)(({ theme }) => ({
  padding: '5px 10px',
  minWidth: theme.spacing(6.5),
  [theme.breakpoints.up('sm')]: {
    minWidth: theme.spacing(12)
  }
}))

export const RacwaRedirectEdit = (props: any) => {
  const { label, content, link } = useFieldApi(props)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container>
      <Grid item container direction="column" xs={9} gap={2}>
        <Grid item>
          <Typography variant="h6">{label}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: '400' }}>
            {content}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs={3} justifyContent="flex-end">
        <StyledEditButton type="button" size={ isMobile ? 'small' : 'medium' } href={link}
          onClick={() => {
            logFieldTouched(`Edit - ${label as string}`)
          }}>
          <FontAwesomeIcon size='xs' icon={faArrowUpRightFromSquare} style={{ paddingRight: '1rem' }} />
          Edit
        </StyledEditButton>
      </Grid>
    </Grid>
  )
}

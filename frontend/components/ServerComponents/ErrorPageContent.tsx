
import { StyledImageButton } from '@/components/StyledComponents/ContentfulButton.styled'
import { StyledBannerGrid, StyledContentWrapperGrid, StyledExpandingSpacerGrid, StyledIcon, StyledSectionGrid, StyledSectionHeading } from '@/components/StyledComponents/errorPage.styled'
import { type IconProp } from '@fortawesome/fontawesome-svg-core'
import { Button, Grid, Typography } from '@mui/material'
import { colors } from '@racwa/styles'
import FontAwesomeIcon from '@/components/ClientComponents/FontAwesomeIcon'

interface ErrorPageContentProps {
  heading: string
  title: string
  subtitle: string
}

const IconButton = ({ icon, label }: { icon: IconProp, label: string }) => {
  return (
    <Grid item
      width={{ xs: '100%', md: '20%' }}
      flexGrow={1}>
        <StyledImageButton href='/'>
          <Grid container direction={{ xs: 'row', md: 'column' }} gap={1} alignItems='center'>
            <StyledIcon icon={icon}/>
            <Grid item>
              {label}
            </Grid>
          </Grid>
        </StyledImageButton>
    </Grid>
  )
}

const ErrorPageContent = ({ heading, title, subtitle }: ErrorPageContentProps) => {
  return (
    <>
      <StyledBannerGrid>
        <Typography variant='h1'
                    textAlign='center'
                    color={colors.white}
                    fontSize={{ xs: 32, md: 60 }}>
                      {heading}
        </Typography>
      </StyledBannerGrid>
      <StyledContentWrapperGrid>
        <Typography color={colors.dieselDeep}
                    fontWeight={400}
                    fontSize={{ xs: 20, md: 27 }}>
                        {title}
        </Typography>
        <Typography color={colors.dieselDeeper}>
            {subtitle}
        </Typography>
      </StyledContentWrapperGrid>
      <StyledExpandingSpacerGrid >
        <StyledSectionGrid>
            <StyledSectionHeading variant='h2'>
                Learn more about RAC
            </StyledSectionHeading>
            <Grid container
                    direction={{ xs: 'column', md: 'row' }}
                    width={{ xs: '95%', md: '960px' }}
                    gap={2}>
                    <IconButton icon='car' label='Little Yellow Vans' />
                    <IconButton icon='calendar' label='RAC Milestones' />
                    <IconButton icon='map' label='Membership card' />
                    <IconButton icon='comments' label='Feedback' />
            </Grid>
        </StyledSectionGrid>
        <StyledSectionGrid width={{ xs: '100%', md: '960px' }}
                            paddingY={{ xs: 3, md: 6.5 }}
                            bgcolor={colors.white}>
            <StyledSectionHeading variant='h2'>
                            Let&apos;s get you back on the road
            </StyledSectionHeading>
            <Button variant='contained'
                    color='primary'
                    href='/'
                    size='large'>
                        <FontAwesomeIcon icon='home' style={{ marginRight: 2 }}/>
                        Return home
            </Button>
        </StyledSectionGrid>
      </StyledExpandingSpacerGrid>
     </>
  )
}

export default ErrorPageContent

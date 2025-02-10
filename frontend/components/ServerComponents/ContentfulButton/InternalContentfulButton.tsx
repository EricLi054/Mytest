import CldImage from '@/components/ClientComponents/CldImage';
import FontAwesomeIcon from '@/components/ClientComponents/FontAwesomeIcon';
import {
  StyledButton,
  StyledChevronButton,
  StyledFAIcon,
  StyledIconButton,
  StyledImageButton,
  StyledProfileLinkButton
} from '@/components/StyledComponents/ContentfulButton.styled';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { Grid, Typography } from '@mui/material';

interface InternalContentfulButtonProps {
  longText: string;
  shortText?: string;
  image?: string;
  link: string;
  icon?: IconProp;
  colour?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  border?: boolean;
  variant: 'Image' | 'Profile Link' | 'Icon CTA' | 'CTA Transparent' | 'Chevron' | 'Regular';
  gavalue?: string;
}

function InternalContentfulButton({
  longText,
  shortText,
  image,
  link,
  icon,
  colour,
  border = false,
  variant,
  gavalue
}: InternalContentfulButtonProps) {
  switch (variant) {
    case 'Image':
      return (
        <StyledImageButton href={link} gavalue={gavalue ?? longText}>
          <Grid container direction={{ xs: 'row', md: 'column' }} alignItems='center'>
            {image && (
              <Grid item width={{ xs: '2em', md: '30%' }} sx={{ aspectRatio: '1/1' }} position='relative'>
                <CldImage src={image} fill alt={longText} />
              </Grid>
            )}
            <Grid item>{longText}</Grid>
          </Grid>
        </StyledImageButton>
      );
    case 'Profile Link':
      return (
        <StyledProfileLinkButton href={link} gavalue={gavalue ?? longText}>
          <Grid
            container
            direction={{ xs: 'row', sm: 'column' }}
            gap={{ xs: 2, sm: 4 }}
            textAlign='start'
            flexWrap='nowrap'
          >
            {icon && (
              <Grid item width={16}>
                <StyledFAIcon icon={icon} />
              </Grid>
            )}
            <Grid container item direction='column' width='auto' gap={{ xs: 0, sm: 1 }} flexGrow={1}>
              <Typography variant='h4' fontSize={{ xs: 18, sm: 24 }}>
                {longText}
              </Typography>
              <Typography variant='body1' fontSize={{ xs: 14, sm: 18 }}>
                {shortText}
              </Typography>
            </Grid>
            <Grid item sx={{ display: { xs: 'block', sm: 'none' } }}>
              <FontAwesomeIcon icon='chevron-right' fontSize={14} />
            </Grid>
          </Grid>
        </StyledProfileLinkButton>
      );
    case 'Icon CTA':
      return (
        <StyledIconButton
          fullWidth
          color={colour ?? undefined}
          border={border}
          href={link}
          gavalue={gavalue ?? longText}
        >
          {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: '8px' }} />}
          {longText}
        </StyledIconButton>
      );
    case 'CTA Transparent':
      return (
        <StyledIconButton
          fullWidth
          color={colour ?? undefined}
          border={border}
          href={link}
          sx={{ background: 'transparent' }}
          gavalue={gavalue ?? longText}
        >
          {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: '8px' }} />}
          {longText}
        </StyledIconButton>
      );
    case 'Chevron':
      return (
        <StyledChevronButton fullWidth color={colour ?? undefined} href={link} gavalue={gavalue ?? longText}>
          {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: '8px' }} />}
          {longText}
        </StyledChevronButton>
      );
    case 'Regular':
    default:
      return (
        <StyledButton href={link} gavalue={gavalue ?? longText}>
          {longText}
        </StyledButton>
      );
  }
}

export default InternalContentfulButton;

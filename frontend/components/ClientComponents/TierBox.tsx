'use client';

import { Typography } from '@mui/material';
import { StyledBox } from '../StyledComponents/Box.styled';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import { colors } from '@racwa/styles';
import { logEvent } from '@/utilities/analyticsTagging';

const tierColorMap: Record<string, string> = {
  Blue: colors.racBlue,
  Red: colors.brandDanger,
  Bronze: '#BF8A44',
  Silver: '#9C9D9C',
  Gold: '#E5B53B',
  Free2Go: '#A9C3CB',
  'Gold Life': colors.racYellowLight,
  'RAC Ignite': colors.brandWarning
};

const tierTextColorMap: Record<string, string> = {
  Blue: colors.white,
  Bronze: colors.dieselDeepest,
  Silver: colors.dieselDeepest,
  Gold: colors.dieselDeepest,
  Free2Go: colors.dieselDeepest,
  'Gold Life': colors.dieselDeepest,
  'RAC Ignite': colors.dieselDeepest
};

export const TierBox = ({ person }: { person: PersonInformation }) => {
  return (
    <StyledBox
      sx={{ bgcolor: tierColorMap[person.cardColour as string] }}
      onClick={() => {
        logEvent('Digital card - Tier pill');
      }}
    >
      <Typography fontWeight={400} color={tierTextColorMap[person.cardColour as string]}>
        {person.cardColour?.concat(' member')}
      </Typography>
    </StyledBox>
  );
};

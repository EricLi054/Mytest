import { Grid, Typography } from '@mui/material';
import { IconWrapper, TextCardContainer, TextCardTitle } from '../StyledComponents/PageTextCard.styled';

export interface PageTextCardProps {
  Icon?: () => JSX.Element;
  Title: () => JSX.Element;
  Content: () => JSX.Element;
}
export const PageTextCard: React.FC<PageTextCardProps> = ({ Icon, Title, Content }) => {
  return (
    <TextCardContainer container googleAnalyticsDescription='Member Central - Digital pass inactive'>
      <TextCardTitle container>
        {Icon && (
          <IconWrapper item>
            <Icon />
          </IconWrapper>
        )}

        <Typography variant='h3'>
          <Title />
        </Typography>
      </TextCardTitle>

      <Grid item>
        <Content />
      </Grid>
    </TextCardContainer>
  );
};

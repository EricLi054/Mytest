import { type ButtonProps } from '@/types/cmsTypes/ButtonProps';
import {
  BackgroundImageDiv,
  StyledBannerButton,
  StyledBannerText,
  StyledBannerTextContainer,
  StyledButtonContainer
} from '../../StyledComponents/Banner.styled';
import { type ReactNode } from 'react';

interface InternalBannerProps {
  bannerImage: string;
  bannerText: ReactNode;
  topTasks: ButtonProps[];
}

function InternalBanner({ bannerImage, bannerText, topTasks }: InternalBannerProps) {
  return (
    <BackgroundImageDiv backgroundImage={bannerImage}>
      <StyledBannerTextContainer container justifyContent='center' alignItems='flex-end' paddingX={2}>
        <StyledBannerText>{bannerText}</StyledBannerText>
      </StyledBannerTextContainer>
      {topTasks && (
        <StyledButtonContainer container>
          {topTasks?.map((link: ButtonProps, index: number) => {
            return (
              <StyledBannerButton
                key={index}
                color='primary'
                href={link.link}
                icon={link.icon}
                longText={link.longText}
                shortText={link.shortText ?? link.longText}
              />
            );
          })}
        </StyledButtonContainer>
      )}
    </BackgroundImageDiv>
  );
}

export default InternalBanner;

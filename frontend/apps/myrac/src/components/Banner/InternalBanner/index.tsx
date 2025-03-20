"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import InternalContentfulButton from "#components/Buttons/ContentfulButton/InternalContentfulButton";

import type { BannerImages, BannerLinkCollection } from "../types";
import { BackgroundImageDiv, StyledBannerText, StyledBannerTextContainer, StyledButtonContainer } from "./styled";

// Morning image before 12pm, Afternoon image until 6pm and Evening image until midnight
const getImageForTimeOfDay = (bannerImage: BannerImages) => {
  let secureUrl = bannerImage[0].secureUrl;

  if (bannerImage.length === 3) {
    const hour = new Date().getHours();

    if (hour >= 18 && bannerImage[2]) {
      secureUrl = bannerImage[2].secureUrl;
    } else if (hour >= 12 && bannerImage[1]) {
      secureUrl = bannerImage[1].secureUrl;
    }
  }

  return secureUrl;
};

export const InternalBanner = ({
  bannerImages,
  topTasks,
  bannerText,
}: {
  bannerImages: BannerImages;
  topTasks: BannerLinkCollection;
  bannerText: ReactNode;
}) => {
  const [bannerImage, setBannerImage] = useState("");

  useEffect(() => {
    setBannerImage(getImageForTimeOfDay(bannerImages));
  }, [bannerImages]);

  return (
    <BackgroundImageDiv backgroundImage={bannerImage}>
      <StyledBannerTextContainer container justifyContent="center" alignItems="flex-end" paddingX={2}>
        <StyledBannerText>{bannerText}</StyledBannerText>
      </StyledBannerTextContainer>
      <StyledButtonContainer container>
        {topTasks.map((link) => {
          return <InternalContentfulButton {...link} key={link.longText} colour="primary" variant="Banner" />;
        })}
      </StyledButtonContainer>
    </BackgroundImageDiv>
  );
};

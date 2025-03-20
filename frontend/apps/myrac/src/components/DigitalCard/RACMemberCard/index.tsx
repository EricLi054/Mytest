"use client";

import type { Person } from "#components/MemberDetailsBar/types";
import { useEffect, useState } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid2 as Grid, Typography } from "@mui/material";
import { useModalContext } from "#providers/modal/context";
import { logEvent } from "#utils/analyticsTagging";

import { colors } from "@racwa/styles";
import { CldImage } from "@racwa/ui";

import { useDeviceDetection } from "../../shared/useDeviceDetection";
import AddToWalletDesktopModal from "../AddToWalletDesktopModal";
import AddToWalletMobileModal from "../AddToWalletMobileModal";
import PromotionalTooltip from "./PromotionalTooltip";

export type RACMemberCardProps = {
  person?: Person;
  storageKey?: string;
};

type DigitalPassCookie = {
  count: number;
  lastShown: string;
};

const backgroundColorMap: Record<string, string> = {
  Silver: "#9C9D9C",
  Red: "#F6695E",
};

const RACMemberCard: React.FC<RACMemberCardProps> = ({ person, storageKey = "" }) => {
  const { openModal, closeModalWithEvent } = useModalContext();
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  const [promoCount, setPromoCount] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const showPromoMessaging = () => {
      if (person?.digitalCardDetails?.numberOfPassesInstalled === 0) {
        const storedValue = localStorage.getItem(storageKey);

        if (!storedValue) {
          // On first login show tooltip
          setTooltipOpen(true);
        } else {
          try {
            // Show tooltip if they've only seen it once on a different day
            const cookieValue = JSON.parse(storedValue) as DigitalPassCookie;
            setPromoCount(cookieValue.count);
            if (cookieValue.count < 2 && new Date().toDateString() !== cookieValue.lastShown) {
              setTooltipOpen(true);
            }
          } catch (e) {
            console.debug("Couldn't check promo cookie", e);
          }
        }
      }
    };

    if (storageKey) {
      void showPromoMessaging();
    }
  }, [person?.digitalCardDetails?.numberOfPassesInstalled, storageKey]);

  const closeTooltip = () => {
    localStorage.setItem(storageKey, JSON.stringify({ count: promoCount + 1, lastShown: new Date().toDateString() }));
    setTooltipOpen(false);
  };

  const onDigitalCardClick = () => {
    logEvent("Digital card icon click");
    closeTooltip();

    const passUrl = person?.digitalCardDetails?.passUrl;

    if (!passUrl) {
      console.error("No digital passUrl found");
      return;
    }

    if (isDesktop || isTablet) {
      openModal("Get your digital card now", <AddToWalletDesktopModal digitalCardUrl={passUrl} />, () => {
        closeModalWithEvent("Digital card desktop modal - Close");
      });
    } else if (isMobile) {
      openModal(
        "",
        <AddToWalletMobileModal person={person} addToWalletUrl={passUrl} />,
        () => {
          closeModalWithEvent("Digital card mobile modal - Close");
        },
        true,
      );
    }
  };

  const imageSrc = person?.cardColour ? `myRAC/card-${person.cardColour}-No-Text` : "myRAC/card-None";

  return (
    <PromotionalTooltip tooltipOpen={tooltipOpen} closeTooltip={closeTooltip}>
      <Grid
        id="digital-membership-card"
        width={{ xs: "120px", md: "144px" }}
        height="fit-content"
        position="relative"
        sx={{ aspectRatio: "3/2", cursor: "pointer" }}
        onClick={onDigitalCardClick}
      >
        <CldImage fill src={imageSrc} alt={imageSrc} style={{ borderRadius: 8 }} />
        <Typography
          borderRadius="2px"
          variant="body2"
          marginLeft="8px"
          marginBottom="5.9px"
          position="absolute"
          bottom={0}
          textAlign="center"
          fontWeight="400"
          fontSize={{ xs: "14px", md: "18px" }}
          color={person?.cardColour === "Blue" ? colors.white : colors.dieselDeepest}
          bgcolor={backgroundColorMap[person?.cardColour ?? ""] ?? "transparent"}
          padding="1px 4px"
        >
          <FontAwesomeIcon icon={faEye} style={{ marginRight: 4 }} />
          Digital card
        </Typography>
      </Grid>
    </PromotionalTooltip>
  );
};

export default RACMemberCard;

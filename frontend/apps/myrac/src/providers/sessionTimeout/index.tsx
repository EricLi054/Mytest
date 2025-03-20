"use client";

import type { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Grid2 as Grid, Typography } from "@mui/material";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";
import { useModalContext } from "#providers/modal/context";
import { getSession, signOut, useSession } from "next-auth/react";

import { getADB2CLogoutUrl } from "@racwa/auth/adb2c";

const refreshModalTitle = "Oh no! Your page will time out soon";

type RefreshModalContentProps = {
  onExpiry?: () => Promise<void> | void;
  expiryTime: number;
};

export const RefreshModalContent: React.FC<RefreshModalContentProps> = ({ onExpiry, expiryTime }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const { update } = useSession();
  const { closeModal } = useModalContext();

  const setTime = useCallback(
    (timer?: NodeJS.Timeout) => {
      const secondsUntilExpiry = Math.ceil((expiryTime - Date.now()) / 1000);

      setTimeRemaining(
        `${Math.floor(secondsUntilExpiry / 60)
          .toString()
          .padStart(2, "0")}:${(secondsUntilExpiry % 60).toString().padStart(2, "0")}`,
      );

      if (secondsUntilExpiry <= 0 && !refreshing) {
        if (onExpiry) {
          void onExpiry();
        }
        if (timer) {
          clearInterval(timer);
        }
      }
    },
    [expiryTime, refreshing, onExpiry],
  );

  useEffect(() => {
    setTime();

    const timer = setInterval(() => {
      setTime(timer);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [setTime]);

  const refreshToken = async () => {
    setRefreshing(true);
    await update({ refresh: true });
    setRefreshing(false);
    closeModal();
  };

  return (
    <Grid container direction="column" spacing={4}>
      <Grid size={12}>
        <Box mb={2}>
          <Typography component="h4" variant="h5">
            Your session will expire in {timeRemaining}
          </Typography>
        </Box>
        <Typography variant="body1">Please click &apos;OK&apos; to continue.</Typography>
      </Grid>
      <Grid size={12}>
        <Button
          color={refreshing ? "secondary" : "primary"}
          disabled={refreshing}
          fullWidth
          onClick={async () => {
            await refreshToken();
          }}
          endIcon={refreshing ? <FontAwesomeIcon className="fa-spin" icon="spinner" /> : undefined}
        >
          OK
        </Button>
      </Grid>
    </Grid>
  );
};

export default function SessionTimeoutProvider() {
  const { status } = useSession();
  const [session, setSession] = useState<Session | null>();
  const { openModal, isModalOpen } = useModalContext();
  const router = useRouter();

  const logOutLocalAndSession = useCallback(async () => {
    const logoutUrl = await getADB2CLogoutUrl(window.location.href);
    await signOut();
    router.push(logoutUrl);
  }, [router]);

  const showModal = useCallback(
    (expiryTime: number) => {
      openModal(refreshModalTitle, <RefreshModalContent onExpiry={logOutLocalAndSession} expiryTime={expiryTime} />);
    },
    [openModal, logOutLocalAndSession],
  );

  // This is a workaround as using the session data directly from useSession
  // causes the session expiry to not be set on page refresh
  useEffect(() => {
    const fetchSessionData = async () => {
      if (status === "authenticated") {
        const session = await getSession();
        setSession(session);
      } else {
        setSession(null);
      }
    };
    void fetchSessionData();
  }, [status]);

  useEffect(() => {
    if (session?.expires && !isModalOpen) {
      const currentTime = Date.now();
      const expiryTime = Number(session.expires);
      const timeRemaining = expiryTime - currentTime;

      // check if token has already expired
      if (timeRemaining <= 0) {
        console.debug("Session expired");
        void logOutLocalAndSession();
        return;
      }

      // show modal now if less than 2 minutes left
      if (timeRemaining <= 60000 * 2) {
        showModal(expiryTime);
        return;
      }

      // make modal pop up 2 minutes prior to the expiry of the token
      console.debug(
        `Setting session timeout warning in ${Math.floor((Math.ceil(timeRemaining / 1000) - 120) / 60)
          .toString()
          .padStart(2, "0")}:${((Math.ceil(timeRemaining / 1000) - 120) % 60).toString().padStart(2, "0")}`,
      );
      const modalTimeoutId = setTimeout(
        () => {
          showModal(expiryTime);
        },
        timeRemaining - 60000 * 2,
      );

      return () => {
        clearTimeout(modalTimeoutId);
      };
    }
  }, [session, isModalOpen, logOutLocalAndSession, showModal]);

  return false;
}

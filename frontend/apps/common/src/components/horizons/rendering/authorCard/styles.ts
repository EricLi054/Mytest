export const styles = {
  authorCardWrapper: {
    backgroundColor: "#F3F3F3",
    py: 5,
  },
  authorCardDesktop: {
    display: { xs: "none", sm: "flex" },
    alignItems: "flex-start",
    gap: 4,
  },
  authorCardDesktopAvatarWrapper: {
    flexShrink: 0,
  },
  authorCardDesktopAvatarImage: {
    width: { sm: 100, md: 120 },
    height: { sm: 100, md: 120 },
  },
  authorCardMobile: {
    display: { xs: "flex", sm: "none" },
    alignItems: "center",
    gap: 2,
    mb: 2,
  },
  authorCardMobileAvatarImage: {
    width: 48,
    height: 48,
  },
  authorCardMobileBioWrapper: {
    display: { xs: "flex", sm: "none" },
  },
};

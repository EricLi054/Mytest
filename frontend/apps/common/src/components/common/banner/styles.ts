import { colors } from "@racwa/styles";

export const styles = {
  backgroundImageDiv: (imageUrl: string) => ({
    position: "relative",
    height: "35%",
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: "cover",
    backgroundPosition: { xs: "85%", md: "0.2%" },
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  }),

  styledCard: {
    background: "white",
    position: "absolute",
    left: { lg: "15%", xs: "5%" },
    mt: { xs: "40px", md: "-75px" },
    width: 558,
    height: 134,
    maxWidth: { lg: "500px", xs: "calc(100% - 45px)" },
    borderTop: 4,
    borderColor: colors.racYellow,
    alignItems: "flex-start",
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 8,
    display: "flex",
  },
  styledGrid: {
    justifyContent: "left",
    alignItems: "left",
    alignSelf: "stretch",
    direction: "column",
    wordWrap: "break-word",
    mb: { xs: 4, md: 2 },
    pt: { xs: 0, md: 4 },
    pl: 4,
    pr: 8,
  },
};

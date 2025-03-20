import { colors } from "@racwa/styles";

export const styles = {
  cardHeadingBox: {
    overflow: "hidden",
    flexGrow: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  containerCorner: {
    position: "relative",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "transparent",
    pointerEvents: "none",
  },
  cornerRibbon: {
    backgroundColor: colors.racYellow,
    color: colors.dieselDeepest,
    fontSize: 15,
    fontWeight: 600,
    position: "absolute",
    textAlign: "center",
    padding: "0.5em 2.5em",
    top: -30,
    right: -80,
    transformOrigin: "top left",
    transform: "rotate(45deg)",
    WebkitTransform: "rotate(45deg)",
    overflow: "hidden",
  },
  cardImage: {
    background: "#F4F7F9",
    textAlign: "center",
    justifyItems: "stretch",
  },
  cardContent: {
    px: 0,
    py: 0,
  },
  cardHeading: {
    textAlign: "center",
    pb: 4,
  },
  cardText: {
    pt: 2,
    px: 3,
    fontWeight: 100,
    fontSize: "20px",
    lineHeight: 1.5,
  },
  additionalInfoText: {
    px: 2,
    textAlign: "left",
    color: colors.linkBlue,
  },
  contactButton: {
    pb: 4,
    px: 3,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
    mt: "auto",
  },
};

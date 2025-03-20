export const styles = {
  contentCard: {
    position: "relative",
    width: "auto",
    height: "320px",
    boxShadow: 1,
    borderRadius: 0,
    overflow: "hidden",
  },
  contentImage: {
    position: "relative",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  contentBody: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "rgba(0, 22, 48, 0.5)",
    color: "#fff",
    py: 2,
    backdropFilter: "blur(2px)",
    overflow: "hidden",
    textAlign: "center",
    height: "auto",
  },
  cardRichMediaIcon: { pr: 1, fontSize: "24px" },
  contentReadingTime: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  contentReadingTimeIcon: {
    fontSize: "24px",
    pr: 1,
  },
};

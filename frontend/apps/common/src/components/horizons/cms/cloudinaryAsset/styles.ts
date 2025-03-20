export const styles = {
  captionContainer: {
    position: "relative",
    display: "block",
  },
  captionWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "24px",
    borderRadius: "40px",
    position: "absolute",
    right: 0,
    bottom: 0,
    color: "white",
    backgroundColor: "white",
    py: 2,
    textAlign: "center",
    marginBottom: 2,
    marginRight: 1,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "grey",
      color: "white",
      "& svg": {
        color: "white",
      },
    },
  },
  captionIcon: {
    color: "grey",
    "&:hover": { color: "white" },
  },
};

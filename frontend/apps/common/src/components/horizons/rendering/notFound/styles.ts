export const styles = {
  notFoundImage: {
    position: "relative",
    height: "70vh",
    backgroundImage:
      "url('https://res.rac.com.au/rac-horizons/image/upload/v1740035399/404_background_blurred_t4kwa9.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "center",
    color: "#fff",
  },
  notFoundImageOverlay: {
    position: "absolute",
    width: "100%",
    height: "500px",
    background: "linear-gradient(to top, rgba(0, 22, 48, 0.8), rgba(0, 22, 48, 0) 100%)",
    zIndex: 1,
    backdropFilter: "blur(2px)",
  },
  notFoundContent: { zIndex: 2, pb: "200px", px: 4 },
  notFoundContentButton: {
    textTransform: "none",
    px: 2,
    py: 1,
  },
};

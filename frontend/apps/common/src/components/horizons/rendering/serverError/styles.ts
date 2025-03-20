export const styles = {
  serverErrorImage: {
    position: "relative",
    height: "70vh",
    backgroundImage:
      "url('https://res.rac.com.au/rac-horizons/image/upload/v1740035399/500_background_image_skxhjf.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "center",
    color: "#fff",
  },
  serverErrorImageOverlay: {
    position: "absolute",
    width: "100%",
    height: "500px",
    background: "linear-gradient(to top, rgba(0, 22, 48, 0.8), rgba(0, 22, 48, 0) 100%)",
    zIndex: 1,
    backdropFilter: "blur(2px)",
  },
  serverErrorContent: { zIndex: 2, pb: "200px", px: 4 },
  serverErrorContentButton: {
    textTransform: "none",
    px: 2,
    py: 1,
  },
};

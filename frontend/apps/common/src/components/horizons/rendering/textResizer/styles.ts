export const styles = {
  contentTextSizeUtilButton: (selected: boolean, fontSize: number) => ({
    minWidth: "32px",
    height: "32px",
    padding: "4px",
    alignItems: "center",
    color: "text.primary",
    fontSize: fontSize,
    fontWeight: 500,
    backgroundColor: selected ? "#F3F3F3" : "transparent",
    borderRadius: 0,
    borderColor: "transparent",
    "&:hover": {
      backgroundColor: "#F3F3F3",
      borderColor: "transparent",
    },
  }),
};

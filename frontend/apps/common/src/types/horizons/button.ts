export type ContentfulButton = {
  data: {
    horizons_button: ButtonProps;
  };
} | null;

export type ButtonProps = {
  title: string;
  variant: "contained" | "outlined" | "text";
  colour: "primary" | "secondary";
  text: string;
  link: string;
};

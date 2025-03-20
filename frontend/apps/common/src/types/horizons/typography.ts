import type { RichTextProps } from "#types/common/richTextProps";

export type ContentfulTypography = {
  data: {
    horizons_typography: TypographyProps;
  };
} | null;

export type TypographyProps = {
  title: string;
  layoutSize: "Full width" | "4:8 ratio columns";
  heading: string;
  leftContent: RichTextProps;
  rightContent: RichTextProps;
};

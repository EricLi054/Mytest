import type { RichTextProps } from "./richTextProps";

export type ContentfulFaqSection = {
  data: {
    rac_faqSection: FaqItemSection;
  };
};

export type FaqItemSection = {
  heading: string;
  questionUrls: RichTextProps;
};

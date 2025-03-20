import type { ComponentSwitcherProps } from "#types/common/componentSwitcherProps";
import type { ContentfulFaqSection, FaqItemSection } from "#types/common/faqSection";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";

import { getFaqSectionCollection } from "./actions";
import ContactUsFAQ from "./faqSection";

function FaqSection(props: ComponentSwitcherProps) {
  const { data } = props;
  const [faqs, setFaqs] = useState<FaqItemSection | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: ContentfulFaqSection = (await getFaqSectionCollection(data.sys.id)) as ContentfulFaqSection;

        setFaqs(result.data.rac_faqSection);
      } catch (error) {
        setFaqs(null);
        console.error("Error fetching data:", error);
      }
    };

    void fetchData();
  }, [data.sys.id]);

  if (faqs != null) {
    return (
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <ContactUsFAQ faqs={faqs.questionUrls} />
      </Container>
    );
  } else {
    return null;
  }
}
export default FaqSection;

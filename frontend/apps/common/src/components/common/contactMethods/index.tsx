import type { ComponentSwitcherProps } from "#types/common/componentSwitcherProps";
import type { ContactMethodsSection, ContentfulContactMethodsSection } from "#types/common/contactMethodsSection";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";

import GetInTouchGrid from "../layout/getInTouchGrid";
import { getContactMethodsSection } from "./action";

function ContactMethods(props: ComponentSwitcherProps) {
  const { data } = props;
  const [contactSection, setContactSection] = useState<ContactMethodsSection>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: ContentfulContactMethodsSection = (await getContactMethodsSection(
          data.sys.id,
        )) as ContentfulContactMethodsSection;
        setContactSection(result.data.rac_contactMethods);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    void fetchData();
  }, [data.sys.id]);

  if (contactSection != null) {
    return (
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        {contactSection.rendering === "Grid" && (
          <GetInTouchGrid heading={contactSection.heading} contactNumbers={contactSection.contactNumbersCollection} />
        )}
      </Container>
    );
  }
}
export default ContactMethods;

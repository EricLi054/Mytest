import type { ContentfulItem } from "#types/common/contentfulItem";

import ContactMethods from "../contactMethods";
import FaqSection from "../faqSection";
import WebCardWrapper from "../webCardWrapper";

type ComponentSwitcherProps = {
  component: ContentfulItem;
};

const keyMap: Record<string, React.ComponentType<{ data: ContentfulItem }>> = {
  FaqSection,
  ContactMethods,
  WebCardWrapper,
};

function ComponentSwitcher(props: ComponentSwitcherProps) {
  const { component } = props;

  // Need to replace "rac_" here with an empty string as the keyMap is defined without the prefix
  try {
    const Component = keyMap[component.__typename.replace("rac_", "")];
    if (!Component) {
      console.error("Error: ComponentSwitcher.tsx Component not found: ", component.__typename);
      return null;
    }

    return <Component data={component} />;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default ComponentSwitcher;

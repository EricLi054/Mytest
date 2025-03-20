import { library } from "@fortawesome/fontawesome-svg-core";
import { faCalendar, faCar, faComments, faHouse, faMap } from "@fortawesome/free-solid-svg-icons";

import NotFoundPageContent from ".";

library.add(faCar);
library.add(faCalendar);
library.add(faMap);
library.add(faComments);
library.add(faHouse);

export default {
  title: "MyRAC/Components/Server Components/Error Page Content",
  component: NotFoundPageContent,
  tags: ["@racwa/myrac"],
};

export const NotFound = () => {
  return <NotFoundPageContent />;
};

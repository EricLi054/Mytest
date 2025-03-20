import type { ComponentSwitcherProps } from "./types";
import DataDrivenForm from "../DataDrivenForm";
import ContentfulLink from "../Links/ContentfulLink";
import Typography from "../Typography";
import Grid from "./Grid";
import MustacheImage from "./MustacheImage";
import Placeholder from "./Placeholder";

const keyMap: Record<string, React.FC<{ id: string }>> = {
  DataDrivenForm,
  Grid,
  Link: ContentfulLink,
  Placeholder,
  Typography,
  // TODO: Remove MustacheImage once next-rac-com-au is archived
  MustacheImage,
};

function ComponentSwitcher(props: ComponentSwitcherProps) {
  const { component } = props;

  const Component = keyMap[component.__typename.replace("rac_", "")];

  if (!Component) {
    console.error("Error: ComponentSwitcher.tsx Component not found: ", component.__typename);
    return undefined;
  }

  return <Component id={component.sys.id} />;
}

export default ComponentSwitcher;

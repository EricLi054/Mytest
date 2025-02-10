import ContentfulButton from '@/components/ServerComponents/ContentfulButton/ContentfulButton';
import Grid from './Grid';
import Typography from './Typography';
import DataDrivenForm from '@/components/ServerComponents/DataDrivenForm';
import PolicyDetailsCard from '@/components/ClientComponents/PolicyDetailsCard';
import MustacheImage from './MustacheImage';
import ContentfulLink from './ContentfulLink';
import Placeholder from './Placeholder';

interface ComponentSwitcherProps {
  component: any;
}

const keyMap: Record<string, any> = {
  Button: ContentfulButton,
  DataDrivenForm,
  Grid,
  Typography,
  PolicyDetailsCard,
  MustacheImage,
  Link: ContentfulLink,
  Placeholder
};

async function ComponentSwitcher(props: ComponentSwitcherProps) {
  const { component } = props;

  const Component = keyMap[component?.__typename as string];

  if (!Component) {
    console.error('Error: ComponentSwitcher.tsx Component not found: ', component?.__typename);
    return undefined;
  }

  return <Component data={component} />;
}

export default ComponentSwitcher;

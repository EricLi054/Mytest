import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import { getComponent } from '@/graphql/getComponent';
import InternalContentfulButton from './InternalContentfulButton';

const fields = `
  longText
  shortText
  image
  link
  icon
  colour
  border
  variant
`;

async function ContentfulButton({ data }: ComponentSwitchableProps) {
  const resultData = await getComponent('button', data.sys.id, fields, true);

  if (!resultData) return null;

  return (
    <InternalContentfulButton
      longText={resultData.longText}
      shortText={resultData.shortText}
      image={resultData.image?.length > 0 ? resultData.image[0]?.secure_url : ''}
      link={resultData.link}
      icon={resultData.icon}
      colour={resultData.colour}
      border={resultData.border}
      variant={resultData.variant}
    />
  );
}

export default ContentfulButton;

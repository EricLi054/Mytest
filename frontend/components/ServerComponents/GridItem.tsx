import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import ComponentSwitcher from './ComponentSwitcher';
import StyledGridItem from '../StyledComponents/GridItem.styled';
import { colors } from '@racwa/styles';
import { getComponent } from '@/graphql/getComponent';

interface GridProps extends ComponentSwitchableProps {}

const fields = `
  __typename
  title
  width
  justifyContent
  position
  display
  textColour
  flexGrow
  aspectRatio
  textAlign
`;

async function GridItem(props: GridProps): Promise<React.JSX.Element> {
  const { data } = props;

  const resultData = await getComponent('gridItem', data.sys.id, fields);

  return (
    <StyledGridItem
      item
      width={resultData.width?.includes('{') ? JSON.parse(resultData.width) : resultData.width}
      flexGrow={resultData.flexGrow}
      justifyContent={resultData.justifyContent}
      position={resultData.position}
      display={resultData.display}
      textAlign={resultData.textAlign}
      color={colors[resultData.textColour as keyof typeof colors]}
      style={{ aspectRatio: resultData.aspectRatio }}
    >
      {resultData.contentItemsCollection?.items.map((component: any, index: number) => {
        return <ComponentSwitcher key={index} component={component} />;
      })}
    </StyledGridItem>
  );
}

export default GridItem;

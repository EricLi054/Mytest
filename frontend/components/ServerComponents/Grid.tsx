import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import GridItem from './GridItem';
import ButtonContainer from './ButtonContainer/ButtonContainer';
import { getComponent } from '@/graphql/getComponent';
import StyledGrid from '../StyledComponents/Grid.styled';

interface GridProps extends ComponentSwitchableProps {}

const fields = `
  __typename
  title
  direction
  width
  justifyContent
  alignItems
  textAlign
  gap
  padding
  background
  wrap
`;

async function Grid(props: GridProps): Promise<React.JSX.Element | null> {
  const { data } = props;

  const resultData = await getComponent('grid', data.sys.id, fields);

  if (!resultData) return null;

  return (
    <StyledGrid
      container
      padding={resultData.padding?.includes('{') ? JSON.parse(resultData.padding) : resultData.padding}
      width={resultData.width?.includes('{') ? JSON.parse(resultData.width) : resultData.width}
      alignItems={resultData.alignItems}
      justifyContent={resultData.justifyContent}
      direction={resultData.direction?.includes('{') ? JSON.parse(resultData.direction) : resultData.direction}
      gap={resultData.gap?.includes('{') ? JSON.parse(resultData.gap) : resultData.gap}
      flexWrap={resultData.wrap ?? 'wrap'}
      textAlign={resultData.textAlign}
      backgroundColor={resultData.background ?? undefined}
    >
      {resultData.contentItemsCollection?.items.map((component: any, index: number) => {
        switch (component.__typename) {
          case 'Grid':
            return <Grid key={index} data={component} />;
          case 'GridItem':
            return <GridItem key={index} data={component} />;
          case 'ButtonContainer':
            return <ButtonContainer key={index} data={component} />;
          default:
            return undefined;
        }
      })}
    </StyledGrid>
  );
}

export default Grid;

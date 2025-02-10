import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import ComponentSwitcher from '../ComponentSwitcher';
import { getComponent } from '@/graphql/getComponent';
import React from 'react';
import InternalButtonContainer from './InternalButtonContainer';

const fields = `
  __typename
  title
  stackTogether
  itemsPerRow
  largeWidth
  columnBreakpoint
  gap
`;

async function ButtonContainer({ data }: ComponentSwitchableProps): Promise<React.JSX.Element | null> {
  const resultData = await getComponent('buttonContainer', data.sys.id, fields);

  if (!resultData) return null;

  return (
    <InternalButtonContainer
      stackTogether={resultData.stackTogether}
      itemsPerRow={resultData.itemsPerRow}
      largeWidth={resultData.largeWidth}
      columnBreakpoint={resultData.columnBreakpoint}
      gap={resultData.gap}
    >
      {resultData.contentItemsCollection?.items.map((component: any, index: number) => {
        return <ComponentSwitcher key={index} component={component} />;
      })}
    </InternalButtonContainer>
  );
}

export default ButtonContainer;

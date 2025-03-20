import { colors } from "@racwa/styles";

import type { ComponentSwitchableProps } from "../types";
import ComponentSwitcher from "..";
import { getGridItemData } from "./data";
import StyledGridItem from "./styled";

async function GridItem({ id }: ComponentSwitchableProps): Promise<React.JSX.Element | null> {
  const resultData = await getGridItemData(id);
  if (!resultData) return null;

  return (
    <StyledGridItem
      width={
        resultData.width?.includes("{") ? (JSON.parse(resultData.width) as string) : (resultData.width ?? undefined)
      }
      flexGrow={resultData.flexGrow ?? undefined}
      justifyContent={resultData.justifyContent ?? undefined}
      position={resultData.position ?? undefined}
      display={resultData.display ?? undefined}
      textAlign={resultData.textAlign ?? undefined}
      color={colors[resultData.textColour as keyof typeof colors]}
      style={{ aspectRatio: resultData.aspectRatio ?? undefined }}
    >
      {resultData.contentItemsCollection.items.map((component) => {
        return <ComponentSwitcher key={component.sys.id} component={component} />;
      })}
    </StyledGridItem>
  );
}

export default GridItem;

import ButtonContainer from "#components/Buttons/ButtonContainer";

import type { ComponentSwitchableProps } from "../types";
import GridItem from "../GridItem";
import { getGridData } from "./data";
import StyledGrid from "./styled";

async function Grid({ id }: ComponentSwitchableProps): Promise<React.JSX.Element | null> {
  const resultData = await getGridData(id);

  if (!resultData) return null;

  return (
    <StyledGrid
      container
      padding={
        resultData.padding?.includes("{")
          ? (JSON.parse(resultData.padding) as string)
          : (resultData.padding ?? undefined)
      }
      width={
        resultData.width?.includes("{") ? (JSON.parse(resultData.width) as string) : (resultData.width ?? undefined)
      }
      alignItems={resultData.alignItems ?? undefined}
      justifyContent={resultData.justifyContent ?? undefined}
      direction={resultData.direction ?? undefined}
      gap={resultData.gap?.includes("{") ? (JSON.parse(resultData.gap) as string) : (resultData.gap ?? undefined)}
      flexWrap={resultData.wrap ?? "wrap"}
      textAlign={resultData.textAlign ?? undefined}
      backgroundColor={resultData.background ?? undefined}
    >
      {resultData.contentItemsCollection.items.map((component) => {
        switch (component.__typename) {
          case "rac_Grid":
            return <Grid key={component.sys.id} id={component.sys.id} />;
          case "rac_GridItem":
            return <GridItem key={component.sys.id} id={component.sys.id} />;
          case "rac_ButtonContainer":
            return <ButtonContainer key={component.sys.id} id={component.sys.id} />;
          default:
            return undefined;
        }
      })}
    </StyledGrid>
  );
}

export default Grid;

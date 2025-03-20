import ContentfulButton from "../ContentfulButton";
import { getButtonContainerData } from "./data";
import InternalButtonContainer from "./InternalButtonContainer";

export default async function ButtonContainer({ id }: { id: string }) {
  const buttonContainer = await getButtonContainerData(id);

  return (
    <InternalButtonContainer
      stackTogether={buttonContainer.stackTogether}
      itemsPerRow={buttonContainer.itemsPerRow}
      largeWidth={buttonContainer.largeWidth}
      columnBreakpoint={buttonContainer.columnBreakpoint}
      gap={buttonContainer.gap}
    >
      {buttonContainer.buttons.items.map((button) => {
        return <ContentfulButton key={button.sys.id} id={button.sys.id} />;
      })}
    </InternalButtonContainer>
  );
}

import { getButtonData } from "./data";
import InternalContentfulButton from "./InternalContentfulButton";

export default async function ContentfulButton({ id }: { id: string }) {
  const button = await getButtonData(id);

  return (
    <InternalContentfulButton
      longText={button.longText}
      shortText={button.shortText}
      image={button.image}
      link={button.link}
      icon={button.icon}
      colour={button.colour}
      border={button.border}
      variant={button.variant}
    />
  );
}

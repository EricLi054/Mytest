import { getPerson } from "#graphql/person/queries";

import { getMustacheData } from "./data";

export default async function MustacheTemplates({ id }: { id: string }) {
  const { textColour, template } = await getMustacheData(id);
  const person = await getPerson();

  const replacedTemplate = template.replace("{{person.FirstName}}", person.firstName);

  return textColour?.hex ? (
    <span style={{ color: textColour.hex, overflowWrap: "anywhere" }}>{replacedTemplate}</span>
  ) : (
    replacedTemplate
  );
}

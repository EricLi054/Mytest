import type { EngineeredFormMapperType } from "#types/ComponentMapperType";

import { EditContactDetailsFormStep2 } from "./EditContactDetailsForm";
import { EditNameFormStep2 } from "./EditNameForm";

const keyMap: EngineeredFormMapperType = {
  EditContactDetailsFormStep2,
  EditNameFormStep2,
};

export const EngineeredForm = (props: { name: string }) => {
  const Form = keyMap[props.name];

  if (!Form) {
    console.error("Error: EngineeredForm.tsx Form not found: ", props.name);
    return undefined;
  }

  return <Form />;
};

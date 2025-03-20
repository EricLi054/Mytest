import { racwaComponentMapper } from ".";
import { componentTypes } from "../components";
import { EngineeredForm } from "../components/EngineeredForm";

// This component is to allow us to have a separate mapper for server side only
// This is due to the Engineered form causing imports of server functions
export const serverRacwaComponentMapper = {
  ...racwaComponentMapper,
  [componentTypes.ENGINEERED_FORM]: EngineeredForm,
};

import racwaComponentTypes from './dynamic-components/racwaComponentTypes';
import { racwaComponentMapper } from './racwaComponentMapper';
import { EngineeredForm } from './dynamic-components/EngineeredForm/EngineeredForm';

// This component is to allow us to have a separate mapper for server side only
// This is due to the Engineered form causing imports of server functions
export const serverRacwaComponentMapper = {
  ...racwaComponentMapper,
  [racwaComponentTypes.ENGINEERED_FORM]: EngineeredForm
};

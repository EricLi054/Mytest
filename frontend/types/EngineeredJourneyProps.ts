import { type DigitalCardDetails } from './backendTypes/digitalCardDetails';
import { type PersonAddress } from './backendTypes/personAddress';
import { type PersonInformation } from './backendTypes/personInformation';
import { type EngineeredContentProps } from './cmsTypes/EngineeredContentProps';

export interface EngineeredJourneyProps {
  person?: PersonInformation;
  unmaskedAddress?: PersonAddress;
  digitalCardDetails?: DigitalCardDetails;
  engineeredContent?: EngineeredContentCollection;
}

export class EngineeredContentCollection extends Array<EngineeredContentProps> {
  getById(contentId: string) {
    if (!contentId) return undefined;
    return this.find((e) => e.contentId === contentId);
  }
}

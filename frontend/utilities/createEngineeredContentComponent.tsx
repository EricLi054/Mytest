import EngineeredContent from '@/components/ServerComponents/EngineeredContent';
import { type EngineeredContentCollection } from '@/types/EngineeredJourneyProps';
import { type EngineeredContentType } from '@/types/cmsTypes/EngineeredContentType';
import { type CldImageProps } from 'next-cloudinary';

const createEngineeredContentComponent = (
  contentType: EngineeredContentType,
  contentId: string,
  imageProps?: Partial<CldImageProps>
) => {
  return (engineeredContent: EngineeredContentCollection) => {
    const Component = () => (
      <EngineeredContent
        contentType={contentType}
        data={engineeredContent?.getById(contentId)}
        imageProps={imageProps}
      />
    );
    Component.displayName = contentId;
    return Component;
  };
};

export default createEngineeredContentComponent;

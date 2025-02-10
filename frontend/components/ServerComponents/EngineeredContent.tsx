import CldImage from '../ClientComponents/CldImage';
import { type EngineeredContentProps } from '@/types/cmsTypes/EngineeredContentProps';
import BaseRichTextRenderer from '../DataDrivenForm/dynamic-components/BaseRichTextRenderer';
import FontAwesomeIcon from '../ClientComponents/FontAwesomeIcon';
import { type FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { type CldImageProps } from 'next-cloudinary';
import { type EngineeredContentType } from '@/types/cmsTypes/EngineeredContentType';

const EngineeredContent = ({
  data,
  iconProps,
  imageProps,
  contentType = 'string'
}: {
  data?: EngineeredContentProps;
  iconProps?: Partial<FontAwesomeIconProps>;
  imageProps?: Partial<CldImageProps>;
  contentType?: EngineeredContentType;
}) => {
  try {
    if (!data) return null;

    switch (contentType) {
      case 'richText':
        return data.richTextContent ? <BaseRichTextRenderer richText={data.richTextContent} /> : null;
      case 'image':
        return data.imageContent ? (
          <CldImage
            alt={data.imageContent[0]?.secure_url}
            {...imageProps}
            src={data.imageContent[0]?.secure_url}
            fill
          />
        ) : null;
      case 'icon':
        return data.iconContent ? <FontAwesomeIcon {...iconProps} icon={data.iconContent} /> : null;
      case 'string':
      default:
        return data.stringContent;
    }
  } catch (error) {
    console.error('Error: EngineeredContent.tsx -', error);
    // Handle the error here
    return null;
  }
};

export default EngineeredContent;

import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { type CloudinaryImage } from './CloudinaryImage';
import { type RichTextProps } from './RichTextProps';

export interface EngineeredContentProps {
  contentId: string;
  stringContent?: string;
  iconContent?: IconProp;
  richTextContent?: RichTextProps;
  imageContent?: CloudinaryImage[];
}

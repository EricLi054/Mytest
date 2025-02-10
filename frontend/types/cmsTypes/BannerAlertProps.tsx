import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { type RichTextProps } from './RichTextProps';

export interface BannerAlertProps {
  title: string;
  icon: IconProp;
  bodyText: RichTextProps;
}

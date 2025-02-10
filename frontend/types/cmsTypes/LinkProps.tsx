import { type CloudinaryImage } from './CloudinaryImage';

export interface LinkProps {
  longLinkText: string;
  shortLinkText?: string;
  linkUrl: string;
  linkImage?: CloudinaryImage[];
  googleAnalyticsDescription?: string;
}

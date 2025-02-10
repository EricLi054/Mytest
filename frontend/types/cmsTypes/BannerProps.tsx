import { type ButtonProps } from './ButtonProps'
import { type CloudinaryImage } from './CloudinaryImage'

export interface BannerProps {
  bannerImage: CloudinaryImage[]
  heading: any
  links: { items: ButtonProps[] }
}

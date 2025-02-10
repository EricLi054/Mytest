import { type IconProp } from '@fortawesome/fontawesome-svg-core'
import { type CloudinaryImage } from './CloudinaryImage'

export interface ButtonProps {
  longText: string
  shortText?: string
  link: string
  icon: IconProp
  image?: CloudinaryImage[]
  variant: string
  logoHoverColour?: string
}

import { type CloudinaryImage } from '@/types/cmsTypes/CloudinaryImage'
import type { ImageProps } from '@racwa/react-components'

export function MapImage(image: CloudinaryImage): ImageProps {
  return {
    src: image.secure_url ? image.secure_url : '',
    alt: image.context?.custom?.alt ? image.context.custom.alt : ''
  }
}

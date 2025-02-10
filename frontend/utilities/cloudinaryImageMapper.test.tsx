import { type CloudinaryImage } from '@/types/cmsTypes/CloudinaryImage'
import { MapImage } from '@/utilities/cloudinaryImageMapper'

describe('MapImage', () => {
  test('should return the correct src and alt when image is valid', () => {
    const image: CloudinaryImage = {
      secure_url: 'https://example.com/image.jpg',
      publicId: 'image.jpg',
      context: {
        custom: {
          alt: 'Example Image'
        }
      }
    }

    const expected = {
      src: 'https://example.com/image.jpg',
      alt: 'Example Image'
    }

    expect(MapImage(image)).toEqual(expected)
  })

  test('should return the correct src and undefined alt when image has no alt', () => {
    const image: CloudinaryImage = {
      secure_url: 'https://example.com/image.jpg',
      publicId: 'image.jpg',
      context: {
        custom: {}
      }
    }

    const expected = {
      src: 'https://example.com/image.jpg',
      alt: ''
    }
    expect(MapImage(image)).toEqual(expected)
  })
})

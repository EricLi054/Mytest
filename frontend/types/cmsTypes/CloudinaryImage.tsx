export interface CloudinaryImage {
  secure_url: string
  publicId: string
  context?: {
    custom?: {
      alt?: string
    }
  }
  height?: number
  width?: number
}

interface ICloudinaryConfigurations {
  url: {
    secureDistribution: string
    privateCdn: boolean
  }
}

export const cloudinaryConfig: ICloudinaryConfigurations = {
  url: {
    secureDistribution: 'res.rac.com.au',
    privateCdn: true
  }
}

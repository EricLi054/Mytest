import { type BannerAlertProps } from '@/types/cmsTypes/BannerAlertProps'
import AlertBanner from '../ClientComponents/AlertBanner'
import { getComponent } from '@/graphql/getComponent'
import { type ComponentSwitchableProps } from '@/types/ComponentSwitchableProps'

const fields = `
  banners: bannerAlertsCollection {
    items {
      title
      icon
      bodyText {
        json
      }
    }
  }
`

const AlertBannerList = async({ data }: ComponentSwitchableProps) => {
  const bannerAlertList = await getComponent('bannerAlertList', data.sys.id, fields, true)
  const bannerAlerts: BannerAlertProps[] = bannerAlertList?.banners?.items
  if (bannerAlerts?.length > 0) {
    return bannerAlerts.map((bannerAlert) => {
      return <AlertBanner key={bannerAlert.title} bannerAlert={bannerAlert} />
    })
  }
}

export default AlertBannerList

'use client'

import { type FooterSearchBarProps } from '@/types/cmsTypes/FooterProps'
import { FooterSearchBar as DSSearchBar } from '@racwa/react-components'
import { useRouter } from 'next/navigation'

const FooterSearchBar = ({ placeholderText }: FooterSearchBarProps) => {
  const router = useRouter()
  return (
        <DSSearchBar
          placeHolder={placeholderText}
          onSubmit={(event) => {
            event.preventDefault()
            const input = document.getElementById('search') as HTMLInputElement
            if (input?.value) {
              router.push(`/search#/searchresult?query=${input.value}`)
            }
          }}
        />
  )
}

export default FooterSearchBar

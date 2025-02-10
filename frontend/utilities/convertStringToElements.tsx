// Utility to use with the advanced mustache to be able to use links in the text

import { type SxProps, type Theme, Typography } from '@mui/material'
import { colors } from '@racwa/styles'
import Link from 'next/link'
import { logEvent } from './analyticsTagging'

const convertStringToElements = (string: string, sx?: SxProps<Theme>, source?: string) => {
  // Matches anything with {}
  const regEx = /{(.*?)}/g
  const matches = Array.from(string.matchAll(regEx))
  if (matches?.length > 0) {
    // If matches found we split the string and add the matches as links
    const split = string.split(regEx)
    return (
        <Typography sx={sx}>
          {
            split.map((part) => {
              // Checks if this part is one of the matches or a regular piece of the string
              if (matches.find((p: any) => p[1] === part)) {
                // Splits out the link so we can display the link text and use the actual link
                const splitLink = part.split('|')
                if (splitLink.length > 1) {
                  return <Link
                    href={splitLink[1]}
                    key={part}
                    style={{
                      color: colors.linkBlue
                    }}
                    onClick={() => {
                      logEvent(`Click - ${splitLink[0]} - ${source ?? 'undefined source'}`)
                    }}>
                      {splitLink[0]}
                    </Link>
                }
                return ''
              } else {
                return part
              }
            })
          }
        </Typography>
    )
  } else {
    // No matches found just return the whole thing as a string
    return (
        <Typography sx={sx}>
          {string}
        </Typography>
    )
  }
}

export default convertStringToElements

export const landingPageQuery = (
  slug: string
) => `page: landingPageCollection(limit: 1, where: {slug: \\"${slug.toLocaleLowerCase()}\\"}){
    items {
      __typename
      title
      noLinkRedirect
      enableVwo
      breadcrumbs: breadcrumbsCollection(limit: 5){
        items {
          longLinkText
          linkUrl
        }
      }
      bannerAlerts {
        __typename
        sys {
          id
        }
      }
      navigation {
        __typename
        sys {
          id
        }
      }
      banner {
        __typename
        sys {
          id
        }
      }
      content: contentCollection(limit:10){
        __typename
        items {
          ... on DataDrivenForm {
            __typename
            sys {
              id
            }
          }
          ... on Placeholder {
            __typename
            sys {
              id
            }
          }
          ... on Grid {
            __typename
            sys {
              id
            }
            title
            direction
            width
            justifyContent
            alignItems
            contentItemsCollection {
              items {
                ... on Entry {
                  __typename
                  sys {
                    id
                  }
                }
              }
            }
          }
        }
      }
      footer {
        __typename
        sys {
          id
        }
      }
    }
  }`;

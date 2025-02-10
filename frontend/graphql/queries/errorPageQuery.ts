export const errorPageQuery = (type: string) => `
  query {
    page: errorPageCollection(limit: 1, where: {type: \\"${type}\\"}){
      items {
        __typename
        title
        navigation {
          __typename
          sys {
            id
          }
        }
        heading
        footer {
          __typename
          sys {
            id
          }
        }
      }
    }
  }`

export const standardErrorPageQuery = (
  slug: string
) => `errorPage: standardErrorPageCollection(limit: 1, where: {slug: \\"${slug.toLocaleLowerCase()}\\"}){
  items {
    __typename
    heading
    subHeading
    content {
        json
        links {
        entries {
            inline {
                __typename
                    sys {
                        id
                    }
                }
            }
        }
    }
  }
}`;

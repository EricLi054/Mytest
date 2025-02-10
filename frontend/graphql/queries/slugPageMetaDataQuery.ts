const metaData = `
items {
    metaData {
        title
        description
    }
}
`;

export const slugPageMetaDataQuery = (slug: string) => `
    query {
        page: landingPageCollection(limit: 1, where: {slug: \\"${slug.toLocaleLowerCase()}\\"}){
            ${metaData}
        }
        errorPage: standardErrorPageCollection(limit: 1, where: {slug: \\"${slug.toLocaleLowerCase()}\\"}){
            ${metaData}
        }
    }
`;

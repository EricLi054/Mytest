export const contentQuery = (query: string, sessionKey = '') =>
    `{contentDataRequest(query: "${query.replace(
      /[\n\r]/g,
      ''
    )}", sessionKey: \"${sessionKey}\")}`

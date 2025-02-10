'use server'

async function getData(
  query: string,
  token: string | null = null,
  variables?: unknown
) {
  const daprUrl = process.env.DAPR_HOST ?? 'http://localhost'
  const daprPort = process.env.DAPR_HTTP_PORT ?? '3500'
  const appId = process.env.BACKEND_APP_ID ?? 'backend'
  const method = 'graphql'

  const requestURL = `${daprUrl}:${daprPort}/v1.0/invoke/${appId}/method/${method}`
  const res = await fetch(requestURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Environment: process.env.CONTENTFUL_ENVIRONMENT ?? '',
      SourceSystem: 'myRAC'
    },
    body: JSON.stringify({ query, ...(variables ? { variables } : {}) })
  })

  const data = await res.json()

  if (!res.ok) {
    console.error(
      `Error: getData.js Code: ${res.status} Body: ${JSON.stringify(data)}`
    )
    if (data.errors) {
      if (
        data.errors[0].message === 'Unauthorized' ||
        data.errors[0].code === 'AUTH_NOT_AUTHENTICATED'
      ) {
        throw new Error('Unauthorized')
      }
      return data
    }
    return undefined
  }

  try {
    return data.data
  } catch {
    console.error("Error: getData.js Couldn't parse data:", data)
    return undefined
  }
}

export default getData

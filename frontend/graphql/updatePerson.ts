'use server'

import { MFAJourneyKeys } from '@/components/ClientComponents/MFA/Types/MFAJourneyKeys'

async function updatePerson(dataToUpdate: any, token: string | null = null) {
  const daprUrl = process.env.DAPR_HOST ?? 'http://localhost'
  const daprPort = process.env.DAPR_HTTP_PORT ?? '3500'
  const appId = process.env.BACKEND_APP_ID ?? 'backend'
  const method = 'graphql'

  // Construct the GraphQL query string with variables
  const query = `
    mutation UpdatePerson($person: PersonUpdateMutationInput!, $sessionKey: String!) {
      updatePerson(input: { person: $person, sessionKey: $sessionKey}) {
        person {
          title
          firstName
          middleName
          surname
          mobilePhone
          homePhone
          workPhone
          personalEmailAddress
          postalAddress {
            formattedAddress
          }
        }
        errors {
          ... on HttpError {
            __typename
            errorCode
            message
          }
          ... on UnauthorizedAccessError {
            __typename
            message
          }
          ... on ValidationError {
            __typename
            fieldName
            message
          }
        }
      }
    }
  `

  console.log(`Info: updatePerson.js - Updating person. Query: ${query}`)

  // Construct the variables object
  const variables = {
    person: dataToUpdate,
    sessionKey: MFAJourneyKeys.manageContact
  }

  const requestURL = `${daprUrl}:${daprPort}/v1.0/invoke/${appId}/method/${method}`
  const res = await fetch(requestURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      SourceSystem: 'myRAC'
    },
    body: JSON.stringify({
      query,
      variables
    }),
    cache: 'no-store'
  })

  const data = await res.json()

  if (!res.ok) {
    console.error(
      `Error: updatePerson.js Code: ${res.status} Body: ${JSON.stringify(data)}`
    )
    if (data.errors) {
      return data
    }
    return undefined
  }

  console.log(`Info: updatePerson.js - Person updated Code: ${res.status}`)

  return data
}

export default updatePerson

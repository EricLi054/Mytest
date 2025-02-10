'use server'
import updatePerson from '@/graphql/updatePerson'
import ensureValidSession from '@/utilities/auth/ensureServerSession'
import { getAccessToken } from '@/utilities/getAccessToken'

const personUpdateHandler = async(values: any) => {
  await ensureValidSession()
  const token = await getAccessToken()
  const data = await updatePerson(values, token)

  if (!data || data?.data?.updatePerson?.errors) {
    console.error('Error: personUpdateHandler.js - Update person failed')

    return {
      ok: false,
      message: 'Error sending data'
    }
  }

  return {
    ok: !data.errors,
    data
  }
}

export default personUpdateHandler

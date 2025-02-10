import { getServerSession } from 'next-auth'

const ensureValidSession = async() => {
  const session = await getServerSession()
  if (!session) throw new Error('Unauthorized')
}

export default ensureValidSession

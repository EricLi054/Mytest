import { NextResponse } from 'next/server'

export async function GET() {
  // add liveness checks here
  return NextResponse.json('Healthy', { status: 200 })
}

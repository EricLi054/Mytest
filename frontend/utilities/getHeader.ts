'use server';

import { headers } from 'next/headers';

export default async function getHeader(headerName: string) {
  return headers().get(headerName);
}

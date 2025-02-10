import { contentQuery } from '@/graphql/queries/contentQuery';
import { NextResponse } from 'next/server';

// Required to stop the route from being executed on build
export const dynamic = 'force-dynamic';

const testQuery = `query {
  landingPageCollection(limit: 1) {
    items{
      __typename
    }
  }
}`;

export async function GET() {
  // add readiness checks here
  const daprUrl = process.env.DAPR_HOST ?? 'http://localhost';
  const daprPort = process.env.DAPR_HTTP_PORT ?? '3500';
  const appId = process.env.BACKEND_APP_ID ?? 'backend';
  const requestURL = `${daprUrl}:${daprPort}/v1.0/invoke/${appId}/method/`;

  // Check if we can retrieve page content
  const query = contentQuery(testQuery);
  const contentResult = await fetch(`${requestURL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Environment: process.env.CONTENTFUL_ENVIRONMENT ?? ''
    },
    body: JSON.stringify({ query })
  });
  if (!contentResult.ok) {
    return NextResponse.json('Not ready', { status: 503 });
  }

  return NextResponse.json('Ready', { status: 200 });
}

import { NextResponse } from "next/server";
import { getHealthData } from "#graphql/health";

export async function GET() {
  const healthy = await getHealthData();

  if (!healthy) {
    return NextResponse.json("Not ready", { status: 503 });
  }

  return NextResponse.json("Ready", { status: 200 });
}

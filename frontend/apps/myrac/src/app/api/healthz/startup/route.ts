import { NextResponse } from "next/server";

export function GET() {
  // add startup checks here
  return NextResponse.json("Healthy", { status: 200 });
}

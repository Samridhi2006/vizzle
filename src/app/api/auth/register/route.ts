import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerWithPassword } from "@/server/services/auth.service";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const body = registerSchema.parse(await request.json());
    const response = await registerWithPassword(body);
    return NextResponse.json(response, {
      status: 201,
      headers: corsHeaders(origin),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}

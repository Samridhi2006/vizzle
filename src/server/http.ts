import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "@/server/errors";

export function jsonError(
  status: number,
  error: string,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    details ? { error, details } : { error },
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return jsonError(error.status, error.message, error.details);
  }
  if (error instanceof ZodError) {
    return jsonError(400, "Validation failed", error.flatten());
  }
  if (error instanceof Error) {
    return jsonError(500, error.message);
  }
  return jsonError(500, "Unexpected server error");
}

export function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-api-key, x-vizzle-user",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
}

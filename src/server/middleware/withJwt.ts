import { NextRequest } from "next/server";
import { verifyDashboardJwt } from "@/lib/server/jwt";
import { ApiError } from "@/server/errors";

export interface JwtUser {
  id: string;
  email: string;
  name: string;
}

export async function withJwt(request: NextRequest): Promise<JwtUser> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing or invalid Authorization header");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    throw new ApiError(401, "Missing JWT token");
  }

  try {
    const payload = await verifyDashboardJwt(token);
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    throw new ApiError(401, "Invalid or expired JWT token");
  }
}

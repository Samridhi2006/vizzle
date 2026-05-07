import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getFirebaseAdminAuth,
  hasFirebaseServiceAccount,
} from "@/lib/server/firebase-admin";
import { loginWithFirebase } from "@/server/services/auth.service";
import { handleApiError } from "@/server/http";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders } from "@/server/http";
import { ApiError } from "@/server/errors";

const firebaseSchema = z.object({
  id_token: z.string().min(1),
});

function decodeJwtPayloadUnsafe(token: string) {
  const chunks = token.split(".");
  if (chunks.length < 2) {
    throw new Error("Invalid token format");
  }
  const payloadBase64 = chunks[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const decoded = Buffer.from(payloadBase64, "base64").toString("utf-8");
  return JSON.parse(decoded) as Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const body = firebaseSchema.parse(await request.json());

    let decoded: {
      uid?: string;
      email?: string;
      name?: string;
      sub?: string;
    };

    if (hasFirebaseServiceAccount()) {
      decoded = await getFirebaseAdminAuth().verifyIdToken(body.id_token);
    } else {
      let payload: Record<string, unknown>;
      try {
        payload = decodeJwtPayloadUnsafe(body.id_token);
      } catch {
        throw new ApiError(401, "Invalid Firebase token");
      }
      decoded = {
        uid:
          typeof payload.user_id === "string"
            ? payload.user_id
            : typeof payload.sub === "string"
            ? payload.sub
            : undefined,
        email: typeof payload.email === "string" ? payload.email : undefined,
        name:
          typeof payload.name === "string"
            ? payload.name
            : typeof payload.displayName === "string"
            ? payload.displayName
            : undefined,
        sub: typeof payload.sub === "string" ? payload.sub : undefined,
      };
    }

    const uid = decoded.uid ?? decoded.sub;
    if (!uid || !decoded.email) {
      return NextResponse.json(
        { error: "Invalid Firebase token payload" },
        { status: 401, headers: corsHeaders(origin) }
      );
    }

    const response = await loginWithFirebase({
      firebaseUid: uid,
      email: decoded.email,
      name: decoded.name ?? decoded.email.split("@")[0],
    });

    return NextResponse.json(response, {
      status: 200,
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

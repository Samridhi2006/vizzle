import { JWTPayload, SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface JwtPayload extends JWTPayload {
  sub: string;
  email: string;
  name: string;
}

export async function signDashboardJwt(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
}

export async function verifyDashboardJwt(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });

  return payload as unknown as JwtPayload;
}

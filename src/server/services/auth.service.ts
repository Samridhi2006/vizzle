import { prisma } from "@/lib/server/prisma";
import { comparePassword, hashPassword } from "@/lib/server/crypto";
import { signDashboardJwt } from "@/lib/server/jwt";
import { ApiError } from "@/server/errors";
import { AuthResponse } from "@/types";
import { isAdminEmail } from "@/server/admin";

function toAuthResponse(
  token: string,
  user: { id: string; email: string; name: string }
): AuthResponse {
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    is_admin: isAdminEmail(user.email),
  };
}

export async function registerWithPassword(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
    },
  });

  const token = await signDashboardJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

  return toAuthResponse(token, user);
}

export async function loginWithPassword(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const email = input.email.trim().toLowerCase();

  // ── Admin bypass ─────────────────────────────────────────────────────────
  // If the email is in ADMIN_EMAILS and ADMIN_PASSWORD is set and matches,
  // skip normal credential check and upsert the user directly.
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (isAdminEmail(email) && adminPassword) {
    if (input.password !== adminPassword) {
      throw new ApiError(401, "Invalid credentials");
    }
    const adminUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: "Admin" },
    });
    const token = await signDashboardJwt({
      sub: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
    });
    return toAuthResponse(token, adminUser);
  }
  // ─────────────────────────────────────────────────────────────────────────

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = await signDashboardJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

  return toAuthResponse(token, user);
}

export async function loginWithFirebase(input: {
  firebaseUid: string;
  email: string;
  name: string;
}): Promise<AuthResponse> {
  const email = input.email.trim().toLowerCase();
  const firebaseUid = input.firebaseUid.trim();
  const displayName = input.name.trim() || "Vizzle User";

  let user = await prisma.user.findUnique({ where: { firebaseUid } });
  if (!user) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: {
          firebaseUid,
          name: byEmail.name || displayName,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          firebaseUid,
          name: displayName,
        },
      });
    }
  }

  const token = await signDashboardJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  return toAuthResponse(token, user);
}

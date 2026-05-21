import { NextRequest, NextResponse } from "next/server";
import { withJwt } from "@/server/middleware/withJwt";
import { assertDashboardCors } from "@/server/cors";
import { corsHeaders, handleApiError } from "@/server/http";
import { isAdminEmail } from "@/server/admin";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: NextRequest) {
  try {
    const origin = assertDashboardCors(request);
    const user = await withJwt(request);

    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Forbidden: admin access only" },
        { status: 403, headers: corsHeaders(origin) }
      );
    }

    const [usersCount, storesCount, usageCount, productsCount, users] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.tryonLog.count(),
      prisma.product.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          stores: {
            include: {
              _count: {
                select: { tryonLogs: true, products: true },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        totals: {
          users:    usersCount,
          stores:   storesCount,
          usage:    usageCount,
          products: productsCount,
        },
        users: users.map((u) => ({
          id:         u.id,
          name:       u.name,
          email:      u.email,
          joinedAt:   u.createdAt,
          stores:     u.stores.length,
          storeNames: u.stores.map((s) => s.storeName),
          products:   u.stores.reduce((sum, s) => sum + s._count.products, 0),
          usage:      u.stores.reduce((sum, s) => sum + s._count.tryonLogs, 0),
        })),
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "*";
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}

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

    const [usersCount, storesCount, usageCount, productsCount, totalCreditsRes, users] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.tryonLog.count(),
      prisma.product.count(),
      prisma.creditWallet.aggregate({ _sum: { balance: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          stores: {
            include: {
              creditWallet: true,
              storeTier: true,
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
          users:        usersCount,
          stores:       storesCount,
          usage:        usageCount,
          products:     productsCount,
          totalCredits: totalCreditsRes._sum.balance ?? 0,
        },
        users: users.map((u) => ({
          id:           u.id,
          name:         u.name,
          email:        u.email,
          joinedAt:     u.createdAt,
          storesCount:   u.stores.length,
          stores:       u.stores.length, // Backward compatibility for number
          storeNames:   u.stores.map((s) => s.storeName), // Backward compatibility for string[]
          storeList: u.stores.map((s) => ({
            id:          s.id,
            storeName:   s.storeName,
            domain:      s.domain,
            tier:        s.storeTier?.tier ?? "UNPAID",
            reqsPerHr:   s.storeTier?.requestsPerHour ?? 0,
            reqsPerDay:  s.storeTier?.requestsPerDay ?? 0,
            balance:     s.creditWallet?.balance ?? 0,
            usage:       s._count.tryonLogs,
            products:    s._count.products,
          })),
          products:     u.stores.reduce((sum, s) => sum + s._count.products, 0),
          usage:        u.stores.reduce((sum, s) => sum + s._count.tryonLogs, 0),
          totalBalance: u.stores.reduce((sum, s) => sum + (s.creditWallet?.balance ?? 0), 0),
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

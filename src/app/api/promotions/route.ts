import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// Dozvoljeni origin-i
const ALLOWED_ORIGINS: string[] = [
  "http://localhost:3000",
  "https://acx-cms.vercel.app",
  process.env.FRONTEND_URL ?? "",
].filter((o): o is string => Boolean(o));

function withCors(req: Request, res: NextResponse) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}

// --- OPTIONS ---
export async function OPTIONS(req: Request) {
  return withCors(req, new NextResponse(null));
}

// --- GET: sve promocije ---
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const promo = await prisma.promotion.findUnique({ where: { id } });
      if (!promo) {
        return withCors(
          req,
          new NextResponse(JSON.stringify({ error: "Promocija nije pronađena." }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      return withCors(
        req,
        new NextResponse(JSON.stringify(promo), {
          headers: { "Content-Type": "application/json" },
        })
      );
    }

    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return withCors(
      req,
      new NextResponse(JSON.stringify(promotions), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch (error) {
    console.error(error);
    return withCors(
      req,
      new NextResponse(JSON.stringify({ error: "Greška na serveru." }), {
        status: 500,
      })
    );
  }
}

// --- POST: kreiranje ili update promocije ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      image,
      title,
      description,
      status,
      activeStatus,
      content,
      dateActive,
    } = body;

    if (!title) {
      return new Response(JSON.stringify({ error: "Naslov je obavezan." }), {
        status: 400,
      });
    }

    const savedPromotion = await prisma.promotion.upsert({
      where: { id: id ?? "" },
      update: {
        image,
        title,
        description,
        status,
        activeStatus,
        content,
        dateActive: dateActive ? new Date(dateActive) : null,
      },
      create: {
        image,
        title,
        description,
        status,
        activeStatus,
        content,
        dateActive: dateActive ? new Date(dateActive) : new Date(),
      },
    });

    return new Response(JSON.stringify(savedPromotion), { status: 201 });
  } catch (error) {
    console.error("❌ API /promotions error:", error);
    return new Response(JSON.stringify({ error: "Greška na serveru." }), {
      status: 500,
    });
  }
}

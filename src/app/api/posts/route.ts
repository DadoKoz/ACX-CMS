import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";


function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// --- OPTIONS preflight ---
export async function OPTIONS() {
  return withCors(new NextResponse(null));
}

// --- GET: lista svih vijesti ili po slug ---
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (slug) {
      const post = await prisma.post.findUnique({ where: { slug } });
      if (!post) {
        return withCors(
          new NextResponse(JSON.stringify({ error: "Vijest nije pronađena." }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      return withCors(new NextResponse(JSON.stringify(post), { headers: { "Content-Type": "application/json" } }));
    }

    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    return withCors(new NextResponse(JSON.stringify(posts), { headers: { "Content-Type": "application/json" } }));
  } catch (error) {
    console.error(error);
    return withCors(new NextResponse(JSON.stringify({ error: "Greška na serveru." }), { status: 500 }));
  }
}

// --- POST: kreiranje nove vijesti ---
export async function POST(req: Request) {
  try {
    const { slug, contentHtml, contentCss } = await req.json();
    if (!slug) return withCors(NextResponse.json({ error: "Slug je obavezan." }, { status: 400 }));
    if (!contentHtml) return withCors(NextResponse.json({ error: "Nedostaje sadržaj." }, { status: 400 }));

    const titleMatch = contentHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].trim() : slug;

    let cleanHtml = contentHtml;
    if (titleMatch) cleanHtml = cleanHtml.replace(/<h1[^>]*>.*?<\/h1>/i, "");

    const savedPost = await prisma.post.upsert({
      where: { slug },
      update: { title, contentHtml: cleanHtml, contentCss },
      create: { slug, title, contentHtml: cleanHtml, contentCss },
    });

    return withCors(NextResponse.json(savedPost, { status: 201 }));
  } catch (error) {
    console.error("❌ API /api/posts error:", error);
    return withCors(NextResponse.json({ error: "Greška na serveru." }, { status: 500 }));
  }
}


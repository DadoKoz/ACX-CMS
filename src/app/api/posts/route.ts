import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// Lista dozvoljenih origin-a
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

// --- OPTIONS preflight ---
export async function OPTIONS(req: Request) {
  return withCors(req, new NextResponse(null));
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
          req,
          new NextResponse(JSON.stringify({ error: "Vijest nije pronađena." }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      return withCors(
        req,
        new NextResponse(JSON.stringify(post), {
          headers: { "Content-Type": "application/json" },
        })
      );
    }

    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    return withCors(
      req,
      new NextResponse(JSON.stringify(posts), {
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

// --- POST: kreiranje ili update vijesti ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      slug,
      title,
      subtitle,
      summary,
      image,
      gallery,
      videoUrl,
      author,
      source,
      category,
      tags,
      metaTitle,
      metaDescription,
      status,
      publishDate,
      readingTime,
      contentHtml,
      contentCss,
    } = body;

    if (!slug || !title) {
      return new Response(JSON.stringify({ error: "Slug i title su obavezni." }), { status: 400 });
    }

    const savedPost = await prisma.post.upsert({
      where: { slug },
      update: {
        title,
        subtitle: subtitle || null,
        summary: summary || null,
        image: image || null,
        gallery: gallery || [],
        videoUrl: videoUrl || null,
        author: author || null,
        source: source || null,
        category: category || null,
        tags: tags || [],
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        status: status || "draft",
        publishDate: publishDate ? new Date(publishDate) : null,
        readingTime: readingTime || null,
        contentHtml: contentHtml || null,
        contentCss: contentCss || null,
      },
      create: {
        slug,
        title,
        subtitle: subtitle || null,
        summary: summary || null,
        image: image || null,
        gallery: gallery || [],
        videoUrl: videoUrl || null,
        author: author || null,
        source: source || null,
        category: category || null,
        tags: tags || [],
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        status: status || "draft",
        publishDate: publishDate ? new Date(publishDate) : null,
        readingTime: readingTime || null,
        contentHtml: contentHtml || null,
        contentCss: contentCss || null,
      },
    });

    return new Response(JSON.stringify(savedPost), { status: 201 });
  } catch (error) {
    console.error("❌ API /posts error:", error);
    return new Response(JSON.stringify({ error: "Greška na serveru." }), { status: 500 });
  }
}


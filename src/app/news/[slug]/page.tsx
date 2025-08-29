"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Article = {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  contentCss?: string;
};

export default function NewsPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`/api/posts?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <p className="p-10 text-[#FFFF00]">Učitavanje...</p>;
  if (!article)
    return <p className="p-10 text-red-400">Vijest nije pronađena.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 text-white  mt-30 p-20 rounded-4xl mr-55">
      <h1 className="text-3xl font-bold mb-6">{article.title}</h1>

      {/* ✅ prikaz sa CSS + HTML - u NewsDetailPage */}
      <div className="news-content prose prose-invert relative max-w-none">
        {article.contentCss && (
          <style dangerouslySetInnerHTML={{ __html: article.contentCss }} />
        )}
        <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      </div>

      <div className="mt-10 flex justify-end">
        <Link
          href={`/editor/${article.slug}`}
          className="bg-[#FFFF00] text-black px-6 py-2 rounded-lg font-semibold transition"
        >
          Editor
        </Link>
      </div>
    </div>
  );
}

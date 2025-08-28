"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import GrapesEditor from "@/app/components/editor/GrapesEditor";

type Article = {
  slug: string;
  contentHtml: string;
  contentCss?: string;
};

export default function EditorSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ unwrap params
  const { slug } = use(params);

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

  if (loading) return <p className="p-10 text-yellow-400">Učitavanje...</p>;
  if (!article)
    return <p className="p-10 text-red-400">Vijest nije pronađena.</p>;

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-100 ">
      <GrapesEditor initialData={article} />
    </div>
  );
}

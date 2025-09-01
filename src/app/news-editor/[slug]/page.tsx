// app/form-editor/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NewsFormPage from "@/app/components/add-news/add-news-form";

type Post = {
  slug: string;
  title: string;
  summary?: string;
  contentHtml: string;
  image?: string;
  videoUrl?: string;
  author?: string;
  source?: string;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: string;
  publishDate?: string;
  readingTime?: number;
  published: boolean;
};

export default function FormEditor() {
  const { slug } = useParams();
  const [initialData, setInitialData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts?slug=${slug}`);
        if (!res.ok) throw new Error("Vijest nije pronađena");
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <p className="text-[#FFFF00] p-10">Učitavanje...</p>;
  if (!initialData)
    return <p className="text-red-400 p-10">Vijest nije pronađena.</p>;

  // Prosljeđujemo podatke u formu
  return <NewsFormPage initialData={initialData} />;
}

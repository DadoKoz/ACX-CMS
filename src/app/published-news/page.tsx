"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3 } from "lucide-react";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  image?: string;
  contentHtml: string;
  createdAt: string;
};

const PublishedNewsPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Greška pri dohvaćanju vijesti");
      const data = await res.json();
      setArticles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const extractImage = (html?: string) => {
    if (!html) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const img = doc.querySelector("img");
    return img ? img.getAttribute("src") : null;
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-yellow/80">
        Objavljene vijesti
      </h1>

      {loading && <p className="text-[#FFFF00]">Učitavanje...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((a) => {
          const img = a.image || extractImage(a.contentHtml);
          return (
            <div
              key={a.id}
              className="flex gap-4 items-center border border-gray-700 rounded-[20px] overflow-hidden p-4 hover:bg-white/7 transition"
            >
              {img && (
                <img
                  src={img}
                  alt={a.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm line-clamp-2">
                  {a.title}
                </h3>
                {a.summary && (
                  <p className="text-gray-300 text-xs line-clamp-2">
                    {a.summary}
                  </p>
                )}
              </div>

              {/* Edit ikona */}
              <Link
                href={`/news/${a.slug}`}
                className="text-yellow hover:text-yellow/80 transition p-2 rounded-full"
              >
                <Edit3 className="w-5 h-5 text-[#FFFF00]" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublishedNewsPage;

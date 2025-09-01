"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  contentHtml?: string;
  image?: string;
  videoUrl?: string;
  author?: string;
  source?: string;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  publishDate?: string;
  readingTime?: number;
};

export default function NewsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/posts?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <p className="p-10 text-[#FFFF00]">Učitavanje...</p>;
  if (!article)
    return <p className="p-10 text-red-400">Vijest nije pronađena.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white/5 rounded-2xl text-white shadow-lg">
      {/* Naslov */}
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {/* Meta podaci */}
      <div className="text-gray-400 text-sm mb-4 flex flex-wrap gap-2">
        {article.author && <span>Autor: {article.author}</span>}
        {article.source && <span>Izvor: {article.source}</span>}
        {article.category && <span>Kategorija: {article.category}</span>}
        {article.publishDate && (
          <span>
            Objavljeno: {new Date(article.publishDate).toLocaleDateString()}
          </span>
        )}
        {article.readingTime && <span>{article.readingTime} min čitanja</span>}
      </div>

      {/* Kratki opis */}
      {article.summary && (
        <p className="mb-4 text-gray-300">{article.summary}</p>
      )}

      {/* Slika */}
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-auto rounded-lg mb-4 object-cover"
        />
      )}

      {/* Video */}
      {article.videoUrl && (
        <div className="mb-4">
          <iframe
            className="w-full h-64 rounded-lg"
            src={article.videoUrl}
            title={article.title}
            allowFullScreen
          />
        </div>
      )}

      {/* Sadržaj */}
      {article.contentHtml && (
        <div
          className="prose prose-invert max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      )}

      {/* Tagovi */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* EDIT gumb */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => router.push(`/news-editor/${article.slug}`)}
          className="bg-[#FFFF00] text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Edituj vijest
        </button>
      </div>
    </div>
  );
}

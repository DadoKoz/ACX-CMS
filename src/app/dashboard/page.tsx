"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3 } from "lucide-react";

type Article = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  image?: string;
  contentHtml?: string;
  createdAt: string;
};

const DashboardPage = () => {
  const { data } = useSession();
  const router = useRouter();
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

  const AdvancedSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400 opacity-50 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );

  const getValidImage = (article: Article) => {
    if (!article.image) return null;
    try {
      new URL(article.image);
      return article.image;
    } catch {
      return null;
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto text-white mt-20">
      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Ukupno vijesti", value: articles.length },
          {
            title: "Objavljene",
            value: articles.filter((a) => a.summary).length,
          },
          { title: "Draft", value: articles.filter((a) => !a.summary).length },
          { title: "Pregledi danas", value: "----" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-2xl p-6 shadow hover:bg-white/10 transition"
          >
            <p className="text-gray-300 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold text-yellow mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Grid: Dugme za formu i objavljene vijesti */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dugme za formu */}
        <div className="bg-white/5 rounded-[30px] p-6 flex flex-col items-center justify-center h-[400px]">
          <h2 className="text-xl font-semibold mb-6 text-yellow/80 text-center">
            Dodaj novu vijest
          </h2>
          <button
            onClick={() => router.push("/news-form")}
            className="inline-block bg-[#FFFF00] text-black px-6 py-3 rounded-lg font-semibold  transition"
          >
            Otvori Formu
          </button>
        </div>

        {/* Objavljene vijesti */}
        <div className="bg-white/5 rounded-[30px] p-6 flex flex-col h-[400px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-yellow/80">
            Objavljene vijesti
          </h2>
          {loading && <AdvancedSpinner />}
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex flex-col gap-4">
            {articles.map((a) => {
              const img = getValidImage(a);
              return (
                <div
                  key={a.id}
                  className="flex gap-4 items-center border border-gray-700 rounded-[20px] overflow-hidden p-2 hover:bg-white/7 transition"
                >
                  {img && (
                    <img
                      src={img}
                      alt={a.title}
                      className="w-24 h-16 object-cover rounded-lg"
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
                  <Link
                    href={`/single-news/${a.slug}`}
                    className="text-yellow hover:text-yellow/80 transition p-2 rounded-full"
                  >
                    <Edit3 className="w-5 h-5 text-[#FFFF00]" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

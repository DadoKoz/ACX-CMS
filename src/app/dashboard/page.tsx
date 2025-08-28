"use client";

import { useSession } from "next-auth/react";
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

const DashboardPage = () => {
  const { data, status } = useSession();
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
    <div className="w-full max-w-screen-2xl mx-auto text-white mt-50">
      {/* Naslov */}
      {/* <h1 className="text-3xl font-bold mb-8">Dashboard</h1> */}

      {/* Statistic Cards */}
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

      {/* Grid: Editor + Objavljene vijesti */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Uđi u Editor */}
        <Link
          href="/editor"
          className="bg-white/5  rounded-[30px] p-6 flex flex-col justify-center items-center hover:bg-white/7 transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-yellow/80">
            Uđi u Editor
          </h2>
          <p className="text-gray-300 text-sm text-center mb-4">
            Kreiraj ili uređuj vijesti brzo i jednostavno.
          </p>
          <span className="inline-block bg-yellow text-[#FFFF00] px-4 py-2 rounded-lg font-semibold hover:bg-yellow/90 transition">
            Otvori Editor
          </span>
        </Link>

        {/* Card 2: Objavljene vijesti */}
        <div className="bg-white/5  rounded-[30px] p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-yellow/80">
            Objavljene vijesti
          </h2>

          {loading && <p className="text-[#FFFF00]">Učitavanje...</p>}
          {error && <p className="text-red-400">{error}</p>}

          <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2">
            {articles.map((a) => {
              const img = a.image || extractImage(a.contentHtml);
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

                  {/* Edit ikona */}
                  <Link
                    href={`/news/${a.slug}`} // vodi na editor za tu vijest
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

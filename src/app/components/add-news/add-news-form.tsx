"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Post {
  title: string;
  slug: string;
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
}

interface NewsFormPageProps {
  initialData?: Post;
}

const NewsFormPage = ({ initialData }: NewsFormPageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    contentHtml: initialData?.contentHtml || "",
    image: initialData?.image || "",
    videoUrl: initialData?.videoUrl || "",
    author: initialData?.author || "",
    source: initialData?.source || "",
    category: initialData?.category || "",
    tags: initialData?.tags || [],
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    status: initialData?.status || "draft",
    publishDate: initialData?.publishDate || "",
    readingTime: initialData?.readingTime || "",
    published: initialData?.published || false,
  });

  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async (newPost: Post) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error("Greška prilikom dodavanja vijesti");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setMessage("✅ Vijest je dodana!");
      router.push("/dashboard");
    },
    onError: () => setMessage("❌ Greška prilikom dodavanja vijesti"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.contentHtml) {
      setMessage("❗ Naslov, slug i sadržaj su obavezni.");
      return;
    }
    mutation.mutate({
      ...formData,
      contentHtml: formData.contentHtml.replace(/\n/g, "<br/>"),
      publishDate: formData.publishDate
        ? new Date(formData.publishDate).toISOString()
        : undefined,
      readingTime: formData.readingTime
        ? Number(formData.readingTime)
        : undefined,
    });
  };

  const formatDateForInput = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-10 space-y-3 rounded-xl bg-white/5"
    >
      {/* Naslov i Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Naslov"
          value={formData.title}
          onChange={(e) => {
            const newTitle = e.target.value;
            setFormData({
              ...formData,
              title: newTitle,
              slug: newTitle
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, ""),
            });
          }}
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
        <input
          type="text"
          placeholder="Slug (URL)"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
      </div>

      {/* Sažetak i sadržaj */}
      <input
        type="text"
        placeholder="Kratki opis"
        value={formData.summary}
        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
        className="w-full p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
      />

      <textarea
        placeholder="Sadržaj (HTML)"
        value={formData.contentHtml}
        onChange={(e) =>
          setFormData({ ...formData, contentHtml: e.target.value })
        }
        rows={4}
        className="w-full h-[230px] p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] resize-none outline-none"
      />

      {/* Slika i video */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="URL slike"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
        <input
          type="text"
          placeholder="Video URL"
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData({ ...formData, videoUrl: e.target.value })
          }
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
      </div>

      {/* Autor i izvor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Autor"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
        <input
          type="text"
          placeholder="Izvor"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
      </div>

      {/* Kategorija i tagovi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Kategorija"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
        <input
          type="text"
          placeholder="Tagovi (odvojeni zarezom)"
          value={formData.tags.join(",")}
          onChange={(e) =>
            setFormData({
              ...formData,
              tags: e.target.value.split(",").map((t) => t.trim()),
            })
          }
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
      </div>

      {/* SEO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Meta Title (SEO)"
          value={formData.metaTitle}
          onChange={(e) =>
            setFormData({ ...formData, metaTitle: e.target.value })
          }
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
        <input
          type="text"
          placeholder="Meta Description (SEO)"
          value={formData.metaDescription}
          onChange={(e) =>
            setFormData({ ...formData, metaDescription: e.target.value })
          }
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
      </div>

      {/* Datum i vrijeme čitanja */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          type="datetime-local"
          value={formatDateForInput(formData.publishDate)}
          onChange={(e) =>
            setFormData({ ...formData, publishDate: e.target.value })
          }
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
        <input
          type="number"
          placeholder="Vrijeme čitanja (min)"
          value={formData.readingTime || ""}
          onChange={(e) =>
            setFormData({ ...formData, readingTime: e.target.value })
          }
          className="p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
        />
      </div>

      {/* Status */}
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="w-full p-1 text-sm rounded-2xl bg-white/5 text-white focus:border-[#FFFF00] outline-none"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      {/* Gumbi */}
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="px-3 py-1 text-sm rounded-2xl bg-white/5 border border-gray-600 text-white hover:bg-gray-600 transition"
        >
          Odustani
        </button>
        <button
          type="submit"
          className="px-3 py-1 text-sm rounded-2xl bg-[#FFFF00] text-black font-semibold hover:bg-yellow-400 transition"
        >
          Spremi
        </button>
      </div>

      {message && (
        <p
          className={`text-center text-xs mt-1 ${
            message.startsWith("✅") ? "text-green-400" : "text-red-400"
          } font-medium`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default NewsFormPage;

"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface ContentBlock {
  id: string;
  type:
    | "heading"
    | "paragraph"
    | "image"
    | "list"
    | "button"
    | "video"
    | "footnote"
    | "quote";
  translationKey: string;
  props?: {
    [key: string]: any;
  };
}

export interface Promotion {
  id?: string;
  image: string;
  title: string;
  description: string;
  status: string;
  activeStatus: "Active" | "Upcoming" | "Closed";
  content: ContentBlock[];
  dateActive?: string;
}

interface PromotionFormProps {
  initialData?: Promotion;
}

const PromotionForm = ({ initialData }: PromotionFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Promotion>({
    id: initialData?.id,
    image: initialData?.image || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "draft",
    activeStatus: initialData?.activeStatus || "Upcoming",
    content: initialData?.content || [],
    dateActive: initialData?.dateActive || "",
  });

  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async (promotion: Promotion) => {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotion),
      });
      if (!res.ok) throw new Error("Greška prilikom spremanja promocije");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      setMessage("✅ Promocija je spremljena!");
      router.push("/promotions");
    },
    onError: () => setMessage("❌ Greška prilikom spremanja promocije"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setMessage("❗ Naslov je obavezan.");
      return;
    }

    mutation.mutate({
      ...formData,
      dateActive: formData.dateActive
        ? new Date(formData.dateActive).toISOString()
        : undefined,
    });
  };

  // Dodaj novi content block
  const addContentBlock = () => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: "paragraph",
      translationKey: "",
      props: { text: "" },
    };
    setFormData({ ...formData, content: [...formData.content, newBlock] });
  };

  // Promjena tipa ili vrijednosti content blocka
  const updateContentBlock = (id: string, field: string, value: any) => {
    const updated = formData.content.map((block) =>
      block.id === id
        ? {
            ...block,
            [field]: value,
          }
        : block
    );
    setFormData({ ...formData, content: updated });
  };

  const updateBlockProp = (id: string, propKey: string, value: any) => {
    const updated = formData.content.map((block) =>
      block.id === id
        ? { ...block, props: { ...block.props, [propKey]: value } }
        : block
    );
    setFormData({ ...formData, content: updated });
  };

  const removeContentBlock = (id: string) => {
    setFormData({
      ...formData,
      content: formData.content.filter((b) => b.id !== id),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-30 p-8 space-y-4 rounded-2xl bg-white/5"
    >
      <input
        type="text"
        placeholder="Naslov"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-2 rounded-2xl bg-white/5 text-white focus:border-yellow-400 outline-none"
      />

      <input
        type="text"
        placeholder="Opis"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full p-2 rounded-2xl bg-white/5 text-white focus:border-yellow-400 outline-none"
      />

      <input
        type="text"
        placeholder="Slika (URL)"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        className="w-full p-2 rounded-2xl bg-white/5 text-white focus:border-yellow-400 outline-none"
      />

      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="w-full p-2 rounded-2xl bg-white/5 text-white focus:border-yellow-400 outline-none"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <select
        value={formData.activeStatus}
        onChange={(e) =>
          setFormData({
            ...formData,
            activeStatus: e.target.value as Promotion["activeStatus"],
          })
        }
        className="w-full p-2 rounded-2xl bg-white/5 text-white focus:border-yellow-400 outline-none"
      >
        <option value="Active">Active</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Closed">Closed</option>
      </select>

      <input
        type="datetime-local"
        value={formData.dateActive}
        onChange={(e) =>
          setFormData({ ...formData, dateActive: e.target.value })
        }
        className="w-full p-2 rounded-2xl bg-white/5 text-white focus:border-yellow-400 outline-none"
      />

      {/* ContentBlock editor */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold">Content</h3>
        {formData.content.map((block) => (
          <div key={block.id} className="bg-white/10 p-2 rounded-2xl space-y-2">
            <select
              value={block.type}
              onChange={(e) =>
                updateContentBlock(block.id, "type", e.target.value)
              }
              className="w-full p-1 rounded-2xl bg-white/5 text-white"
            >
              <option value="heading">Heading</option>
              <option value="paragraph">Paragraph</option>
              <option value="image">Image</option>
              <option value="list">List</option>
              <option value="button">Button</option>
              <option value="video">Video</option>
              <option value="footnote">Footnote</option>
              <option value="quote">Quote</option>
            </select>

            <input
              type="text"
              placeholder="Translation Key"
              value={block.translationKey}
              onChange={(e) =>
                updateContentBlock(block.id, "translationKey", e.target.value)
              }
              className="w-full p-1 rounded-2xl bg-white/5 text-white"
            />

            {/* Props editor */}
            {block.type === "paragraph" && (
              <textarea
                placeholder="Text"
                value={block.props?.text || ""}
                onChange={(e) =>
                  updateBlockProp(block.id, "text", e.target.value)
                }
                className="w-full p-1 rounded-2xl bg-white/5 text-white"
              />
            )}

            {block.type === "image" && (
              <>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={block.props?.src || ""}
                  onChange={(e) =>
                    updateBlockProp(block.id, "src", e.target.value)
                  }
                  className="w-full p-1 rounded-2xl bg-white/5 text-white"
                />
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={block.props?.alt || ""}
                  onChange={(e) =>
                    updateBlockProp(block.id, "alt", e.target.value)
                  }
                  className="w-full p-1 rounded-2xl bg-white/5 text-white"
                />
              </>
            )}

            <button
              type="button"
              onClick={() => removeContentBlock(block.id)}
              className="px-2 py-1 text-xs rounded-2xl bg-red-500 text-black"
            >
              Ukloni blok
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addContentBlock}
          className="px-3 py-1 rounded-2xl bg-[#FFFF00] text-black"
        >
          Dodaj content blok
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-2 rounded-2xl bg-[#FFFF00] text-black font-semibold transition"
      >
        Spremi promociju
      </button>

      {message && (
        <p
          className={`text-center mt-2 ${
            message.startsWith("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default PromotionForm;

"use client";

import { useEffect, useState } from "react";
import PromotionCard from "@/app/components/single-promotion-card/promotion-card";

// Definicija tipa Promotion
interface ContentBlock {
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
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    items?: string[];
    className?: string;
    onClick?: () => void;
    title?: string;
  };
}

interface Promotion {
  id: string;
  image: string;
  title: string;
  description: string;
  status: string;
  activeStatus: "Active" | "Upcoming" | "Closed";
  content: ContentBlock[];
  dateActive?: string;
}

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/promotions");
        if (!res.ok) throw new Error("Greška prilikom učitavanja promocija");
        const data = await res.json();
        setPromotions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading)
    return <p className="text-yellow-400 p-10">Učitavanje promocija...</p>;
  if (promotions.length === 0)
    return <p className="text-red-400 p-10">Nema promocija.</p>;

  return (
    <div className="container mx-auto p-8">
      <div className="grid justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
        {promotions.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            image={promotion.image}
            title={promotion.title}
            description={promotion.description}
            status={promotion.status}
            activeStatus={promotion.activeStatus}
            dateActive={promotion.dateActive}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;

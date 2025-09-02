"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PromotionForm, {
  Promotion,
} from "../components/promotions-add/promotion-form";
import PromotionCard from "../components/single-promotion-card/promotion-card";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/promotions");
        if (!res.ok) throw new Error("Greška prilikom učitavanja promocija");
        const data: Promotion[] = await res.json();
        setPromotions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Statistika promocija
  const stats = [
    { title: "Ukupno promocija", value: promotions.length },
    {
      title: "Active",
      value: promotions.filter((p) => p.activeStatus === "Active").length,
    },
    {
      title: "Upcoming",
      value: promotions.filter((p) => p.activeStatus === "Upcoming").length,
    },
    {
      title: "Closed",
      value: promotions.filter((p) => p.activeStatus === "Closed").length,
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8 mt-30">
      {/* Kartice statistike */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-2xl p-6 shadow hover:bg-white/10 transition"
          >
            <p className="text-gray-300 text-sm">{s.title}</p>
            <h2 className="text-2xl font-bold text-yellow mt-2">{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Grid: dugme za formu i lista promocija */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lijevi div: dugme za formu */}
        <div className="bg-white/5 rounded-[30px] p-6 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold mb-6 text-yellow/80 text-center">
            Dodaj novu promociju
          </h2>
          <button
            onClick={() => router.push("/promotions-form")}
            className="inline-block bg-[#FFFF00] text-black px-6 py-3 rounded-lg font-semibold transition"
          >
            Otvori formu
          </button>
        </div>

        {/* Desni div: lista promocija */}
        <div className="md:overflow-y-auto md:max-h-[80vh] p-2">
          {loading ? (
            <p className="text-yellow-400 p-4">Učitavanje promocija...</p>
          ) : promotions.length === 0 ? (
            <p className="text-red-400 p-4">Nema promocija.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {promotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  image={promotion.image}
                  title={promotion.title}
                  description={promotion.description}
                  status={promotion.status}
                  activeStatus={promotion.activeStatus}
                  dateActive={promotion.dateActive || ""}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;

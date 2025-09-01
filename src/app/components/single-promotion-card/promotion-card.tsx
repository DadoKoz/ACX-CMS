"use client";

interface PromotionCardProps {
  image: string;
  title: string;
  description: string;
  status: string;
  activeStatus: string;
  dateActive?: string;
}

const PromotionCard = ({
  image,
  title,
  description,
  status,
  activeStatus,
  dateActive,
}: PromotionCardProps) => {
  return (
    <div className="bg-white/5 p-4 rounded-lg shadow hover:shadow-lg transition mt-10">
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-md mb-2"
      />
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-anthracit-40 text-sm mb-2">{description}</p>
      <div className="flex justify-between items-center text-xs">
        <span
          className={`px-2 py-1 rounded ${
            activeStatus === "Active"
              ? "bg-green-500 text-black"
              : activeStatus === "Closed"
              ? "bg-red-500 text-black"
              : "bg-[#FFFF00] text-black"
          }`}
        >
          {activeStatus}
        </span>
        {dateActive && (
          <span className="text-anthracit-40">
            {new Date(dateActive).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default PromotionCard;

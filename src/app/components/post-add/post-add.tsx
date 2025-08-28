"use client";

import Link from "next/link";

export const PostAdd = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Link href="/editor">
        <button className="px-8 py-4 bg-[#FFFF00] text-black font-bold text-lg rounded-xl shadow-lg hover:bg-yellow-300 transition">
          ➕ Uđi u editor
        </button>
      </Link>
    </div>
  );
};

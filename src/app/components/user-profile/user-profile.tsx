"use client";

import { useSession } from "next-auth/react";
import { FaUserAltSlash, FaUserEdit, FaUserSecret } from "react-icons/fa";

export const UserProfile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-white">Učitavanje profila...</div>;
  }

  if (!session || !session.user) {
    return <div className="text-red-400">Niste ulogovani.</div>;
  }

  const { name, email } = session.user;

  return (
    <div className="bg-white/5 text-white p-6 rounded-2xl    w-[1230px] mx-auto mt-30 ">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Admin profil
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400 block text-sm">Ime i prezime:</label>
          <p className="text-lg font-medium">{name}</p>
        </div>

        <div>
          <label className="text-gray-400 block text-sm">Email adresa:</label>
          <p className="text-lg font-medium">{email}</p>
        </div>

        <div className="flex justify-end mt-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FFFF00] text-black transition  rounded-md shadow-md">
            <FaUserEdit /> Izmeni profil
          </button>
        </div>
      </div>
    </div>
  );
};

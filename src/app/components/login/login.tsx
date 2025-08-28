"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Neispravni podaci");
    }
  };

  return (
    <div className="flex w-screen h-screen">
      {/* Lijeva polovina - background slika */}
      <div className="hidden md:flex w-1/2 h-full relative">
        <Image
          src="/background-auth.png"
          alt="Auth Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />{" "}
        {/* opcionalni overlay */}
      </div>

      {/* Desna polovina - login forma */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-anthracit p-8">
        <div className="w-full max-w-md p-10 bg-white/5 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo-light.svg"
              alt="Logo"
              width={160}
              height={60}
              priority
              className="drop-shadow-lg"
            />
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Prijava
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Unesite email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00]"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Lozinka
              </label>
              <input
                type="password"
                placeholder="Unesite lozinku"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00]"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold bg-[#FFFF00] text-black transition"
            >
              Prijavi se
            </button>

            <div className="text-sm text-center mt-4 text-gray-400">
              Nemaš nalog?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-[#FFFF00] hover:underline"
              >
                Registruj se
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

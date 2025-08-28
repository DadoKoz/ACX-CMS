"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [code, setCode] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedForm = localStorage.getItem("registerForm");
    if (savedForm) setForm(JSON.parse(savedForm));
  }, []);

  useEffect(() => {
    if (step === 1) localStorage.setItem("registerForm", JSON.stringify(form));
  }, [form, step]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Šaljem kod...");
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log("Verifikacioni kod:", data.code);
      setStep(2);
      setMessage("Kod je poslat na email.");
    } else {
      const data = await res.json();
      setMessage(data.error || "Greška pri slanju koda.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !code) {
      setMessage("Sva polja i verifikacioni kod su obavezni.");
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, code }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.removeItem("registerForm");
      router.push("/login");
    } else {
      setMessage(data.error || "Greška pri registraciji.");
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

      {/* Desna polovina - register forma */}
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
            {step === 1 ? "Registruj se" : "Unesi verifikacioni kod"}
          </h2>

          <form
            onSubmit={step === 1 ? handleSendCode : handleRegister}
            className="space-y-5"
          >
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Ime
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
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
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00]"
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Verifikacioni kod
                </label>
                <input
                  type="text"
                  placeholder="Unesite kod sa emaila"
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00]"
                  required
                />
              </div>
            )}

            {message && <p className="text-red-400 text-sm">{message}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold bg-[#FFFF00] text-black transition"
            >
              {step === 1 ? "Pošalji kod" : "Registruj se"}
            </button>

            <div className="text-sm text-center mt-4 text-gray-400">
              Imaš nalog?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-[#FFFF00] hover:underline"
              >
                Prijavi se
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

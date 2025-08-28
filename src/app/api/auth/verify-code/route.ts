// app/api/auth/verify-code/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  // Provera da li su email i kod prosleđeni
  if (!email || !code) {
    return NextResponse.json({ error: "Email i kod su obavezni." }, { status: 400 });
  }

  try {
    // Potraži kod u bazi
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: { email, code },
    });

    // Proveri da li je kod pronađen i da nije istekao
    if (!verificationRecord) {
      return NextResponse.json({ error: "Neispravan verifikacioni kod." }, { status: 400 });
    }

    if (new Date() > new Date(verificationRecord.expiredAt)) {
      return NextResponse.json({ error: "Verifikacioni kod je istekao." }, { status: 400 });
    }

    return NextResponse.json({ message: "Kod je ispravan." });
  } catch (error) {
    console.error("Greška prilikom verifikacije koda:", error);
    return NextResponse.json({ error: "Nešto je pošlo po zlu." }, { status: 500 });
  }
}

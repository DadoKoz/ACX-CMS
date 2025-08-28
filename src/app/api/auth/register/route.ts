import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/auth";
import { verifyCode } from "@/app/lib/verifications";

export async function POST(req: Request) {
  const { name, email, password, code } = await req.json();

  // ✅ Debug: Prikaz šta je stiglo
  console.log("PRIMLJENI PODACI:", { name, email, password, code });

  // ✅ Debug: Prikaz da li je kod ispravan
  console.log("Provera koda:", await verifyCode(email, code));

  // 1. Proveri kod
  const isCodeValid = await verifyCode(email, code);
  if (!isCodeValid) {
    return NextResponse.json(
      { error: "Neispravan verifikacioni kod." },
      { status: 400 }
    );
  }

  // 2. Proveri da li korisnik već postoji
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Korisnik već postoji." }, { status: 400 });
  }

  // 3. Hash lozinke i kreiraj korisnika
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return NextResponse.json({
    message: "Uspešno registrovan!",
    user: { id: user.id, email: user.email },
  });
}

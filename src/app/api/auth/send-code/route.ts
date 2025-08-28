import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/app/lib/prisma";
import { generateCode } from "@/app/lib/verifications";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email je obavezan." }, { status: 400 });
  }

  try {
    const code = generateCode();

    // Postavi istek za 10 minuta
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 10);

    // Sačuvaj kod u bazu
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiredAt,
      },
    });

    // Pošaljite email sa kodom
    const transporter = nodemailer.createTransport({
      service: "gmail", // koristi odgovarajući servis
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Tvoja Aplikacija" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verifikacioni kod za registraciju",
      text: `Tvoj verifikacioni kod je: ${code}`,
      html: `<p>Tvoj verifikacioni kod je: <strong>${code}</strong></p>`,
    });

    return NextResponse.json({ message: "Kod uspešno poslat na email." });
  } catch (error) {
    console.error("Greška prilikom slanja emaila:", error);
    return NextResponse.json({ error: "Nešto je pošlo po zlu." }, { status: 500 });
  }
}

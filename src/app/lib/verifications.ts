// app/lib/verifications.ts

import { prisma } from "@/app/lib/prisma";

// ✅ Generiši random 6-cifreni kod
export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ Sačuvaj kod za dati email u bazi (važi 10 minuta)
export const storeVerificationCode = async (email: string, code: string): Promise<void> => {
  const expiredAt = new Date();
  expiredAt.setMinutes(expiredAt.getMinutes() + 10); // Kod važi 10 minuta

  // Spremi kod u bazu podataka
  await prisma.verificationCode.create({
    data: {
      email,
      code,
      expiredAt,
    },
  });
};

// ✅ Proveri da li je kod ispravan (koristeći bazu podataka)
export const verifyCode = async (email: string, code: string): Promise<boolean> => {
  // Potraži verifikacioni kod u bazi podataka
  const verificationRecord = await prisma.verificationCode.findFirst({
    where: { email, code },
  });

  if (!verificationRecord) {
    return false; // Kod nije pronađen
  }

  // Proveri da li je kod istekao
  if (new Date() > new Date(verificationRecord.expiredAt)) {
    return false; // Kod je istekao
  }

  return true; // Kod je validan
};

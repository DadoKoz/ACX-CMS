// app/lib/cleanup.ts

import { prisma } from "@/app/lib/prisma";

export const cleanupExpiredCodes = async () => {
  const currentTime = new Date();

  // Briše sve verifikacione kodove koji su prošli
  await prisma.verificationCode.deleteMany({
    where: {
      expiredAt: {
        lt: currentTime, // Briše kodove koji su istekao
      },
    },
  });
};

// Pozovi ovu funkciju svakih 5 minuta (ili postavi interval u tvojoj aplikaciji)
setInterval(cleanupExpiredCodes, 5 * 60 * 1000); // Svaka 5 minuta

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Primjer za dodavanje početnog usera
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin",
      // ako imaš password ili druge obavezne kolone
    },
  });

  // Primjer za dodavanje početne vijesti
  await prisma.post.create({
    data: {
      title: "Prva vijest",
      slug: "prva-vijest",
      summary: "Ovo je primjer vijesti",
      content: "<p>Ovo je sadržaj vijesti</p>",
      published: true,
      authorId: 1, // obavezno da user sa id=1 postoji
    },
  });

  console.log("Seed završen!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

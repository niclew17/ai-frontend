const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Math" },
        { name: "STEM" },
        { name: "Education" },
        { name: "Social Sciences" },
        { name: "Fine Arts and Communication" },
        { name: "Humanities" },
        { name: "International Studies" },
        { name: "Law" },
        { name: "Life Sciences" },
        { name: "Nursing" },
        { name: "Religious Education" },
      ],
    });
  } catch (error) {
    console.error("Error seeding default categories", error);
  } finally {
    await db.$disconnect();
  }
}

main();

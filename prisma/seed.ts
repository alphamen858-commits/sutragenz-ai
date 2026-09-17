import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed script — add achievement/course rows here as needed.");
  console.log("The current schema tracks achievements per-user directly on the Achievement model,");
  console.log("so seed data depends on real user IDs; run this after your first sign-ups.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

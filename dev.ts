import { PrismaClient } from "@prisma/client";

const main = async() => {
    const prisma = new PrismaClient()

    await prisma.locked.deleteMany();
}

main().then()
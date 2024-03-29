import { PrismaClient } from "@prisma/client";

const main = async() => {
    const prisma = new PrismaClient()

    await prisma.guild.create({ data: { key: "messagesTotal", value: "0" }});
}

main().then()
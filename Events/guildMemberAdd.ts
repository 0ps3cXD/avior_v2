import { PrismaClient } from "@prisma/client";
import { GuildMember, Client, MessageEmbed } from "discord.js";

module.exports = {
    name: "guildMemberAdd",
    async execute(member: GuildMember, client: Client) {
        let embed = new MessageEmbed();
        const prisma = new PrismaClient();
        try {
            await prisma.users.create({
                data: {
                    username: member.user.username,
                    displayname: member.displayName,
                    id: member.id,
                    avatarurl: member.avatarURL() || ""
                }
            });
        }catch (ex: any) {
            console.log(ex.toString())
        }
    }
}
import {Client, CommandInteraction, Interaction, MessageEmbed} from "discord.js";
import { PrismaClient } from "@prisma/client";

module.exports = {
    name: "serverinfo",
    description: "Zeigt dir die Server-Informationen an...",
    async execute(interaction: CommandInteraction, client: Client) {
        const prisma = new PrismaClient();
        let messagesTotal = parseInt((await prisma.guild.findUnique({ where: { key: "messagesTotal" }}))!.value);
        let embed: MessageEmbed = new MessageEmbed()
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.avatarURL()! })
            .setTitle("Server Informationen - Avior")
            .addFields([
                { name: "Member Count", value: interaction.guild!.memberCount.toString() },
                { name: "Kronen User", value: (await interaction.guild!.fetchOwner()).displayName },
                { name: "Insgesamte Nachrichten", value: messagesTotal.toString() }
            ])
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
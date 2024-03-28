import { PrismaClient } from "@prisma/client";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    name: "transferownership",
    description: "Überträgt den Owner-Status auf den User...",
    options: [
        { type: "target", name: "user", description: "User der zum Owner ernannt werden soll", required: true }
    ],
    async execute(interaction: CommandInteraction, client: Client) {
        //console.log(interaction.options.getUser("user")?.id);
        const prisma = new PrismaClient();
        await prisma.temporaryVoice.update({
            where: {
                owner: interaction.user.id!
            },
            data: {
                owner: interaction.options.getUser("user")?.id
            }
        });
        let channel = await prisma.temporaryVoice.findUnique({ where: { owner: interaction.options.getUser("user")?.id!}})
        let embed = new MessageEmbed()
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
            .setColor("GREEN")
            .setTitle("Owner des Channel geändert!")
            .setDescription(`Du hast ${interaction.options.getUser("user")?.displayName} zum Owner des Channels ${channel?.name} gemacht!`)
            .setTimestamp()
            .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! });
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
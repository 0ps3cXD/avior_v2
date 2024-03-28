import { PrismaClient } from "@prisma/client";
import {Client, CommandInteraction, Interaction, MessageEmbed} from "discord.js";

module.exports = {
    name: "deletechannel",
    displayName: "Delete Channel",
    description: "Löscht deinen temporären Voice Channel...",
    async execute(interaction: CommandInteraction, client: Client) {
        const prisma = new PrismaClient();
        const member = client.guilds.cache.get(process.env.GUILDID!)?.members.cache.get(interaction.user.id);
        const channel = await prisma.temporaryVoice.findUnique({ where: { owner: member?.id! }})
        if (member?.voice.channelId! == channel?.id) {
            const foundChannel = await client.channels.cache.get(channel.id);
            await prisma.temporaryVoice.delete({ where: { owner: member?.id! }})
            await foundChannel?.delete();
            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() || interaction.guild?.iconURL()!})
                .setTitle("Channel gelöscht!")
                .setColor("GREEN")
                .setDescription("Dein Voice Channel wurde gelöscht!")
                .setTimestamp()
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }else if (channel?.owner == member?.id){
            const ch = client.channels.cache.get(channel?.id!);
            await ch?.delete();
            const foundChannel = await client.channels.cache.get(channel?.id!);
            await prisma.temporaryVoice.delete({ where: { owner: member?.id! }})
            await foundChannel?.delete();
            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() || interaction.guild?.iconURL()!})
                .setTitle("Channel gelöscht!")
                .setColor("GREEN")
                .setDescription("Dein Voice Channel wurde gelöscht!")
                .setTimestamp()
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}
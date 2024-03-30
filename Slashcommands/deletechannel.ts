import { PrismaClient } from "@prisma/client";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    name: "deletechannel",
    displayName: "Delete Channel",
    description: "Löscht deinen temporären Voice Channel...",
    async execute(interaction: CommandInteraction, client: Client) {
        const prisma = new PrismaClient();
        const member = client.guilds.cache.get(process.env.GUILDID!)?.members.cache.get(interaction.user.id);
        
        const channels = await prisma.temporaryVoice.findMany({ where: { owner: member?.id! }})

        const currentChannel = channels.find(channel => member?.voice.channelId === channel.id);
        
        if (currentChannel) {
            const foundChannel = await client.channels.cache.get(currentChannel.id);
            await prisma.temporaryVoice.delete({ where: { id: currentChannel.id }});
            await foundChannel?.delete();

            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() || interaction.guild?.iconURL()!})
                .setTitle("Channel gelöscht!")
                .setColor("GREEN")
                .setDescription("Dein Voice Channel wurde gelöscht!")
                .setTimestamp()
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() || interaction.guild?.iconURL()!})
                .setTitle("Fehler")
                .setColor("RED")
                .setDescription("Du bist nicht in einem deiner temporären Voice Channels!")
                .setTimestamp()
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

import { PrismaClient } from "@prisma/client";
import { Client, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";

// Initialisiere PrismaClient außerhalb des Befehls-Handlers
const prisma = new PrismaClient();

module.exports = {
    name: "transferownership",
    description: "Überträgt den Owner-Status auf den User...",
    options: [
        { type: "target", name: "user", description: "User, der zum Owner ernannt werden soll", required: true }
    ],
    async execute(interaction: CommandInteraction, client: Client) {
        let member = interaction.member as GuildMember;
        const targetUserId = interaction.options.getUser("user")?.id;
        const currentVoiceChannelId = member?.voice.channelId;

        if (!targetUserId || !currentVoiceChannelId) {
            await interaction.reply({ content: "Fehler: Du musst in einem Voice-Channel sein oder einen gültigen User auswählen.", ephemeral: true });
            return;
        }

        // Stelle sicher, dass der Kanal existiert und der aktuelle Nutzer der Eigentümer ist
        const voiceChannelEntry = await prisma.temporaryVoice.findFirst({
            where: {
                AND: [
                    { owner: interaction.user.id },
                    { id: currentVoiceChannelId }
                ]
            }
        });

        if (!voiceChannelEntry) {
            await interaction.reply({ content: "Du bist nicht der Besitzer eines temporären Voice-Channels oder du bist nicht in deinem temporären Channel.", ephemeral: true });
            return;
        }

        // Aktualisiere den Eigentümer des Kanals
        await prisma.temporaryVoice.update({
            where: { id: currentVoiceChannelId },
            data: { owner: targetUserId }
        });

        const channelName = voiceChannelEntry.name; // Name für die Bestätigungsnachricht

        let embed = new MessageEmbed()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor("GREEN")
            .setTitle("Owner des Channels geändert!")
            .setDescription(`Du hast ${interaction.options.getUser("user")?.username} zum Owner des Channels ${channelName} gemacht!`)
            .setTimestamp()
            .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL() || '' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

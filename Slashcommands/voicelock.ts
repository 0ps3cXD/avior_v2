import { Client, CommandInteraction, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";

// Initialisiere PrismaClient außerhalb des Befehls-Handlers
const prisma = new PrismaClient();

module.exports = {
    name: "voicelock",
    description: "Stellt deinen Channel auf Privat",
    async execute(interaction: CommandInteraction, client: Client) {
        try {
            let member = interaction.member as GuildMember;
            const userVoiceChannelId = member?.voice.channelId;
            if (!userVoiceChannelId) {
                await interaction.reply({ content: "Du musst in einem Voice-Channel sein, um diesen Befehl zu nutzen.", ephemeral: true });
                return;
            }

            // Prüfe, ob der aktuelle Kanal ein temporärer Kanal des Benutzers ist
            const channelEntry = await prisma.temporaryVoice.findFirst({
                where: {
                    AND: [
                        { owner: interaction.user.id },
                        { id: userVoiceChannelId }
                    ]
                }
            });

            if (!channelEntry) {
                await interaction.reply({ content: "Du bist nicht der Besitzer eines temporären Voice-Channels oder du bist nicht in deinem temporären Channel.", ephemeral: true });
                return;
            }

            const channel = interaction.guild?.channels.cache.get(channelEntry.id) as VoiceChannel;

            if (channelEntry.private) {
                // Wenn der Kanal bereits privat ist, setze ihn auf öffentlich
                await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, { CONNECT: true });
                await prisma.temporaryVoice.update({ where: { id: channel.id }, data: { private: false } });
                let embed = new MessageEmbed()
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setColor("GREEN")
                    .setTitle("Privater Channel")
                    .setDescription("Du hast deinen Channel auf **öffentlich** gesetzt!")
                    .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL() || '' });
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                // Wenn der Kanal öffentlich ist, setze ihn auf privat
                await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, { CONNECT: false });
                await prisma.temporaryVoice.update({ where: { id: channel.id }, data: { private: true } });
                let embed = new MessageEmbed()
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setColor("GREEN")
                    .setTitle("Privater Channel")
                    .setDescription("Du hast deinen Channel auf **privat** gesetzt!")
                    .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL() || '' });
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.error("Fehler beim Ändern des Channel-Status: ", error);
            await interaction.reply({ content: "Es gab einen Fehler beim Versuch, den Status deines Channels zu ändern.", ephemeral: true });
        }
    },
};

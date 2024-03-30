import { Client, CommandInteraction, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";

// Initialisiere PrismaClient außerhalb des Befehls-Handlers
const prisma = new PrismaClient();

module.exports = {
    name: "setname",
    description: "Stellt den Namen deines Channels ein...",
    options: [
        { type: "string", name: "name", description: "Namen für den Channel...", required: true }
    ],
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

            await channel.setName(interaction.options.getString("name")!);
            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setColor("GREEN")
                .setTitle("Channelname geändert - Tempvoice")
                .setDescription(`Du hast den Namen deines Channels zu ${interaction.options.getString("name")!} geändert!`)
                .setTimestamp()
                .setFooter({ text: "Avior", iconURL: interaction.guild!.iconURL()! })
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } catch (error) {
            console.error("Fehler beim Ändern des Channel-Status: ", error);
            await interaction.reply({ content: "Es gab einen Fehler beim Versuch, den Status deines Channels zu ändern.", ephemeral: true });
        }
    },
};

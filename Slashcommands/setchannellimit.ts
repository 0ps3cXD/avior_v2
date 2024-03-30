import { Client, CommandInteraction, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import { PrismaClient } from "@prisma/client";

// Initialisiere PrismaClient außerhalb des Befehls-Handlers
const prisma = new PrismaClient();

module.exports = {
    name: "setchannellimit",
    description: "Setzt das Limit für deinen Channel neu...",
    options: [
        { type: "integer", name: "limit", description: "Limit für deinen Channel", required: true }
    ],
    async execute(interaction: CommandInteraction, client: Client) {
        try {
            let member = interaction.member as GuildMember
            // Hole den aktuellen Voice-Kanal, in dem der Benutzer sich befindet
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
            const limit = interaction.options.getInteger("limit", true);
            await channel.setUserLimit(limit);
            
            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setColor("GREEN")
                .setTitle("User Limit geändert")
                .setDescription(`Das User Limit wurde auf ${limit} gesetzt.`)
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL() || '' });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error("Fehler beim Setzen des Channel-Limits: ", error);
            await interaction.reply({ content: "Es gab einen Fehler beim Versuch, das Channel-Limit zu setzen.", ephemeral: true });
        }
    },
}

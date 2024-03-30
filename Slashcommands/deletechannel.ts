import { PrismaClient } from "@prisma/client";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    name: "deletechannel",
    displayName: "Delete Channel",
    description: "Löscht deinen temporären Voice Channel...",
    async execute(interaction: CommandInteraction, client: Client) {
        const prisma = new PrismaClient();
        const member = client.guilds.cache.get(process.env.GUILDID!)?.members.cache.get(interaction.user.id);
        
        // Verwende findMany statt findFirst, um alle Kanäle des Benutzers zu bekommen
        const channels = await prisma.temporaryVoice.findMany({ where: { owner: member?.id! }})

        // Überprüfe, ob der Benutzer in einem seiner Kanäle ist
        const currentChannel = channels.find(channel => member?.voice.channelId === channel.id);
        
        if (currentChannel) {
            // Lösche den Kanal, in dem der Benutzer gerade ist
            const foundChannel = await client.channels.cache.get(currentChannel.id);
            await prisma.temporaryVoice.delete({ where: { id: currentChannel.id }});
            await foundChannel?.delete();
            // An dieser Stelle könntest du entscheiden, ob du alle anderen Kanäle auch löschen möchtest.
            // Wenn ja, könntest du eine Schleife über `channels` laufen lassen und jeden löschen.
            // Beachte, dass dies das aktuelle Vorgehen verändern würde, also passe es entsprechend deiner Bedürfnisse an.

            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL() || interaction.guild?.iconURL()!})
                .setTitle("Channel gelöscht!")
                .setColor("GREEN")
                .setDescription("Dein Voice Channel wurde gelöscht!")
                .setTimestamp()
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            // Optional: Feedback geben, wenn der Benutzer nicht in einem seiner Kanäle ist
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

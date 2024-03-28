import {Client, CommandInteraction, MessageEmbed, VoiceChannel, Role} from "discord.js";
import {PrismaClient} from "@prisma/client";

module.exports = {
    name: "voicelock",
    description: "Stellt deinen Channel auf Privat",
    async execute(interaction: CommandInteraction, client: Client) {
        const prisma = new PrismaClient();
        let channel = (await prisma.temporaryVoice.findUnique({ where: { owner: interaction.user.id }}))!.private;
        let channelAS = interaction.guild?.channels.cache.get((await prisma.temporaryVoice.findUnique({ where: { owner: interaction.user.id }}))!.id)! as VoiceChannel;
        if (!channel) {
            await channelAS.permissionOverwrites.edit(interaction.guild!.roles.everyone, { CONNECT: false });
            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setColor("GREEN")
                .setTitle("Privater Channel")
                .setDescription("Du hast deinen Channel auf **privat** gesetzt!")
                .setFooter({ text: "Avior", iconURL: interaction.guild!.iconURL()! })
            await prisma.temporaryVoice.update({ where: { id: channelAS.id! }, data: { private: true }});
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }else {
            await channelAS.permissionOverwrites.edit(interaction.guild!.roles.everyone, { CONNECT: true });
            let embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setColor("GREEN")
                .setTitle("Privater Channel")
                .setDescription("Du hast deinen Channel auf **öffentlich** gesetzt!")
                .setFooter({ text: "Avior", iconURL: interaction.guild!.iconURL()! })
            await prisma.temporaryVoice.update({ where: { id: channelAS.id! }, data: { private: false }});
            await interaction.reply({ embeds: [embed], ephemeral: true })
        }

    }
}
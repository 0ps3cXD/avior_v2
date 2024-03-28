import {Client, CommandInteraction, Interaction, MessageEmbed, VoiceChannel} from "discord.js";
import {PrismaClient} from "@prisma/client";

module.exports = {
    name: "setchannellimit",
    description: "Setzt das Limit für deinen Channel neu...",
    options: [
        { type: "integer", name: "limit", description: "Limit für deinen Channel", required: true }
    ],
    async execute(interaction: CommandInteraction, client: Client) {
        const prisma = new PrismaClient();
        let channel = interaction.guild?.channels.cache.get((await prisma.temporaryVoice.findUnique({ where: { owner: interaction.user.id }}))!.id)! as VoiceChannel;
        let limit = interaction.options.getInteger("limit")!;
        await channel.setUserLimit(limit);
        let embed = new MessageEmbed()
            .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
            .setColor("GREEN")
            .setTitle("User Limit")
            .setDescription("Du hast das Channel Limit auf " + limit.toString() + " gesetzt!")
            .setFooter({ text: "Avior", iconURL: interaction.guild!.iconURL()! })
        await interaction.reply({ embeds: [embed], ephemeral: true })

    },
}
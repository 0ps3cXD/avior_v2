import {CommandInteraction, Client, MessageEmbed, GuildMember, User} from "discord.js";

module.exports = {
    name: "banner",
    description: "Gibt den Banner des Users zurück",
    options: [
        { type: "target", name: "user", description: "User dessen Banner geholt werden soll...", required: false },
    ],
    async execute(interaction: CommandInteraction, client: Client) {
        let target = interaction.options.getUser("user")!;
        if (target == null) {
            let embed: MessageEmbed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setTitle(`${interaction.user.displayName}´s Banner`)
                .setImage(interaction.user.bannerURL()!)
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                .setTimestamp()
            await interaction.reply({ embeds: [embed]})
        }else {
            let embed: MessageEmbed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setTitle(`${target.displayName!}´s Banner`)
                .setImage(target.bannerURL()!)
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                .setTimestamp()
            await interaction.reply({ embeds: [embed]})
        }
    }
}
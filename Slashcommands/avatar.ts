import {CommandInteraction, Client, MessageEmbed, GuildMember} from "discord.js";

module.exports = {
    name: "avatar",
    description: "Gibt den Avatar des Users zurück",
    options: [
        { type: "target", name: "user", description: "User dessen Avatar geholt werden soll...", required: false },
    ],
    async execute(interaction: CommandInteraction, client: Client) {
        let target = interaction.options.getUser("user")!;
        if (target == null) {
            let embed: MessageEmbed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setTitle(`${interaction.user.displayName}´s Avatar`)
                .setImage(interaction.user.displayAvatarURL()!)
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                .setTimestamp()
            await interaction.reply({ embeds: [embed]})
        }else {
        let user = interaction.options.getUser("target")!;
            let embed: MessageEmbed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setTitle(`${user.username}´s Avatar`)
                .setImage(user.displayAvatarURL()!)
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                .setTimestamp()
            await interaction.reply({ embeds: [embed]})
        }
    }
}
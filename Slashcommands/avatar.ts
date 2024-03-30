import {CommandInteraction, Client, MessageEmbed, GuildMember, User} from "discord.js";

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
            let embed: MessageEmbed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setTitle(`${target.displayName!}´s Avatar`)
                .setImage(target.displayAvatarURL()!)
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                .setTimestamp()
            await interaction.reply({ embeds: [embed]})
        }
    }
}
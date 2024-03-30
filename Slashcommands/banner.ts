import {CommandInteraction, Client, MessageEmbed, GuildMember, User} from "discord.js";

module.exports = {
    name: "banner",
    description: "Gibt den Banner des Users zurück",
    options: [
        { type: "target", name: "user", description: "User dessen Banner geholt werden soll...", required: false },
    ],
    async execute(interaction: CommandInteraction, client: Client) {
        let target: User = interaction.options.getUser("user") ?? interaction.user;
        if (target.banner){
            let embed: MessageEmbed = new MessageEmbed()
                .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()! })
                .setTitle(`${target.displayName}´s Avatar`)
                .setImage(target.bannerURL()!)
                .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                .setTimestamp()
            await interaction.reply({ embeds: [embed]})
        }else {
            await interaction.reply({ content: "Der User hat keinen Banner!", ephemeral: true });
        }
    }
}
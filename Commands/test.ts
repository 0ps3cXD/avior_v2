import {Client, Message, MessageEmbed, MessageActionRow, MessageButton} from "discord.js";

module.exports = {
    name: "test",
    description: "Test Command für Developer",
    async execute(client: Client, message: Message, args: string[]) {
        let embed = new MessageEmbed()
            .setTitle("Ticket - Avior")
            .setAuthor({ name: "Avior Ticket System", iconURL: message.guild?.iconURL()! })
            .setDescription("Klicke den Button unten, um ein Ticket zu eröffnen!")
            .setTimestamp()
            .setFooter({ text: "Avior", iconURL: message.guild?.iconURL()! })
        let actionrow = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId("openticket").setLabel("Ticket erstellen").setStyle("PRIMARY").setEmoji("📩"))
        await message.channel.send({ embeds: [embed], components: [actionrow] })
    },
}
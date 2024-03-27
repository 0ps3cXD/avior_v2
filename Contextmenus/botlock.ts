import { Interaction, Client } from "discord.js";

module.exports = {
    name: "Bot Lock",
    type: "USER",
    async execute(interaction: Interaction, client: Client) {

        await interaction.user.send("test");
    }
}
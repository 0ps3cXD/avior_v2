import {Client, Interaction} from "discord.js";
import fs from "fs";
import path from "path";

module.exports = {
    name: "interactionCreate",
    async execute(interaction: Interaction, client: Client) {
        if (interaction.isContextMenu()) {
            const contextmenuFiles: string[] = fs.readdirSync(path.join(__dirname, "../Contextmenus")).filter(file => file.endsWith(".ts"));
            try {
                let formattedName = interaction.commandName.toLowerCase().trim().replace(' ', "");
                const contextmenu = require(path.join(__dirname, "../Contextmenus", formattedName));
                await contextmenu.execute(interaction, client);
            }catch(ex) {
                // @ts-ignore
                console.log(ex.toString());
                return;
            }
        }
        if (interaction.isCommand()) {
            const slashcommandFiles: string[] = fs.readdirSync(path.join(__dirname, "../Slashcommands")).filter(file => file.endsWith(".ts"))
            try {
                let commandname = interaction.commandName.toLowerCase().trim().replace(" ", "");
                const command = require(path.join(__dirname, "../Slashcommands", commandname));
                await command.execute(interaction, client);
            } catch (ex) {
                // @ts-ignore
                console.log(ex.toString())
                return;
            }
        }
    },
}
import { Client, VoiceChannel } from "discord.js";
import { SlashCommandBuilder} from "@discordjs/builders";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

module.exports = {
    name: "ready",
    async execute(client: Client) {
        const prisma = new PrismaClient();
        console.log(`Logged in as ${client.user?.displayName!}`);
        await client.user?.setPresence({ activities: [{ name: "Avior", type: "PLAYING"}], status: "idle" });

        // Delete all Commands
        /*let commands = await client.guilds.cache.get(process.env.GUILDID!)?.commands.fetch();
        commands?.map(async (command) => {
            await command.delete();
        });*/

        /*------------------------------------------ CONTEXT MENUS ------------------------------------------*/
        const contextmenuFiles: string[] = fs.readdirSync(path.join(__dirname, "../Contextmenus")).filter(file => file.endsWith(".ts"));
        for (const contextmenu of contextmenuFiles){
            const context = require(path.join(__dirname, "../Contextmenus", contextmenu));
            await client.guilds.cache.get(process.env.GUILDID!)?.commands.create({
               name: context.name,
               type: context.type
            });
        }

        /*------------------------------------------ SLASH COMMANDS ------------------------------------------*/
        const slashcommandFiles: string[] = fs.readdirSync(path.join(__dirname, "../Slashcommands")).filter(file => file.endsWith(".ts"));
        for (const file of slashcommandFiles) {
            const command = require(path.join(__dirname, "../Slashcommands", file));
            const commandBuilder = new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description)
                if (command.options) {
                    for (const option of command.options) {
                        switch (option.type) {
                                case "string":
                                    commandBuilder.addStringOption(optionBuilder =>
                                        optionBuilder.setName(option.name)
                                            .setDescription(option.description)
                                            .setRequired(option.required ?? false));
                                    break;
                                case "target":
                                    commandBuilder.addUserOption(optionBuilder =>
                                        optionBuilder.setName(option.name)
                                            .setDescription(option.description)
                                            .setRequired(option.required ?? false));
                                    break;
                                case "integer":
                                    commandBuilder.addIntegerOption(optionBuilder =>
                                        optionBuilder.setName(option.name)
                                            .setDescription(option.description)
                                            .setRequired(option.required ?? false));
                                    break;

                            default:
                                console.log(`Unbekannter Optionstyp: ${option.type} + ${option.name}`);
                        }
                    }
                }
            await client.guilds.cache.get(process.env.GUILDID!)?.commands.create(commandBuilder);
        }

    },
}
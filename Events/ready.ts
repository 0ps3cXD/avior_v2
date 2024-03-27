import { Client, VoiceChannel } from "discord.js";
import { SlashCommandBuilder} from "@discordjs/builders";
import path from "path";
import fs from "fs";
import {ChannelTypes} from "discord.js/typings/enums";

module.exports = {
    name: "ready",
    async execute(client: Client) {
        console.log(`Logged in as ${client.user?.displayName!}`);
        await client.user?.setPresence({ activities: [{ name: "Avior", type: "PLAYING"}], status: "idle" });

        // Delete all Commands
        /*let commands = await client.guilds.cache.get(process.env.GUILDID!)?.commands.fetch();
        commands?.map(async (command) => {
            await command.delete();
        });*/

        /*------------------------------------------ CONTEXT MENUS ------------------------------------------*/
        // register ContextMenus
        /*await client.guilds.cache.get(process.env.GUILDID!)?.commands.create({
            name: "",
            type: "USER"
        })*/
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
            await client.guilds.cache.get(process.env.GUILDID!)?.commands.create(commandBuilder);
        }

    },
}
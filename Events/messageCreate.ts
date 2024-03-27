import {Client, Message, MessageEmbed} from "discord.js";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

module.exports = {
    name: "messageCreate",
    async execute(message: Message, client: Client) {
        if (message.author.bot) return;
        if (!message.content.startsWith(process.env.PREFIX!)) return;
        const prisma = new PrismaClient();
        if (await prisma.locked.findUnique({ where: { id: message.author.id }})) {
            let embed = new MessageEmbed()
                .setAuthor({ name: "Avior", iconURL: message.guild?.iconURL()! })
                .setTitle("Bot Sperre - Avior")
                .setColor("RED")
                .setDescription("Du wurdest des Bot-Netzwerks verwiesen!")
                .setThumbnail(message.author.avatarURL()!)
                .setTimestamp()
                .setFooter({ iconURL: message.author.avatarURL()!, text: message.author.displayName })
            await message.author.send({ embeds: [embed]})
            return;
        }
        const args: string[] = message.content.slice(process.env.PREFIX?.length).trim().split(/ /g);
        const command: string = args.shift()?.toLowerCase()!;

        const commandFiles = fs.readdirSync(path.join(__dirname, "../Commands",)).filter(file => file.endsWith(".ts"));
        const commands: Array<Map<string, string>> = [];
        for (const file of commandFiles) {
            const command = require(path.join(__dirname, "../Commands", file));
            let commandMap: Map<string, string> = new Map<string, string>;
            commandMap.set("name", command.name);
            commandMap.set("description", command.description);
            commands.push(commandMap);
        }

        try {
            const cm = require(path.join(__dirname, "../Commands", command));
            cm.execute(client, message, args);
        }catch {
            return;
        }
    },
}
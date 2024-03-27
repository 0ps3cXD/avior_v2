import {Client, Intents, VoiceState} from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

const eventFiles = fs.readdirSync(path.join(__dirname, "./Events")).filter(file => file.endsWith(".ts"));
for (const file of eventFiles) {
    const event = require(path.join(__dirname, "./Events", file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    }else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}
client.login(process.env.TOKEN)
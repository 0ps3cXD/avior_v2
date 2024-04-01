import { Client, GuildMember, VoiceState } from "discord.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Einmalige Instanzierung

module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState: VoiceState, newState: VoiceState, client: Client) {
        // Umgebungsvariablen prüfen
        const { VOICECREATE, GUILDID, VOICECAT } = process.env;
        if (!VOICECREATE || !GUILDID || !VOICECAT) {
            console.error("Umgebungsvariablen sind nicht korrekt gesetzt.");
            return;
        }

        if (oldState.channelId === VOICECREATE || oldState.channelId === "1223781427389136936" || oldState.channelId === "1223794673651290183") return;
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (newState.channelId === VOICECREATE) {
                const voiceChannel = await client.guilds.cache.get(GUILDID)?.channels.create(newState.member?.displayName || "Neuer Kanal", {
                    type: 'GUILD_VOICE',
                    parent: VOICECAT,
                });
                if (voiceChannel) {
                    const member: GuildMember = newState.member!;
                    await member.voice.setChannel(voiceChannel.id);
                    await prisma.temporaryVoice.create({
                        data: {
                            id: voiceChannel.id,
                            name: voiceChannel.name,
                            owner: newState.member?.user.id!
                        }
                    });
                }
            } else if (oldState.channel?.parent?.id === VOICECAT && oldState.channel?.members.size === 0 && oldState.channel.id !== VOICECREATE) {
                await oldState.channel.delete();
                const channelEntry = await prisma.temporaryVoice.findFirst({
                    where: {
                        AND: [
                            { owner: oldState.member?.id },
                            { id: oldState.channelId! }
                        ]
                    }
                });
                if (channelEntry) {
                    try {
                        await prisma.temporaryVoice.delete({ where: { id: oldState.channelId! }});
                    } catch (e) {
                        console.error("Fehler beim Löschen des temporären Sprachkanals:", e);
                    }
                } else console.log("Kein Channel Entry für User gefunden!");
                
            }
        } catch (ex) {
            console.error("Ein Fehler ist aufgetreten:", ex);
        }
    }
}

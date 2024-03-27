import {Client, GuildMember, VoiceChannel, VoiceState} from "discord.js";
import { PrismaClient } from "@prisma/client";

module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState: VoiceState, newState: VoiceState, client: Client) {
        if (newState.channelId == process.env.VOICECREATE!) {
            const prisma = new PrismaClient();
            const voiceChannel = await client.guilds.cache.get(process.env.GUILDID!)?.channels.create(newState.member?.displayName!, {
                type: 'GUILD_VOICE',
                parent: process.env.VOICECAT,
            });
            const member: GuildMember = newState.member!;
            await member.voice.setChannel(voiceChannel?.id!);
            await prisma.temporaryVoice.create({
                data: {
                    id: voiceChannel?.id!,
                    name: voiceChannel?.name!,
                    owner: member.id
                }
            });
        }

        if (oldState.channel?.parent?.id == process.env.VOICECAT! && oldState.channel?.members.size == 0 && oldState.channel.id != process.env.VOICECREATE!){
            await oldState.channel.delete();
        }
    }
}
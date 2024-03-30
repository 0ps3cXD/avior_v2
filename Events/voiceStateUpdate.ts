import {Client, GuildMember, VoiceState} from "discord.js";
import { PrismaClient } from "@prisma/client";

module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState: VoiceState, newState: VoiceState, client: Client) {
        const prisma = new PrismaClient();
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
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
                            owner: member.id!
                        }
                    });
            }else if (oldState.channel?.parent?.id == process.env.VOICECAT! && oldState.channel?.members.size == 0 && oldState.channel.id != process.env.VOICECREATE!){
                try {
                    await prisma.temporaryVoice.delete({ where: { id: oldState.id }});
                }catch (e) {
                    console.log(e);
                }
                await oldState.channel.delete();
            }
        } catch (ex: any) {
            console.log(ex.toString())
        }
    }
}
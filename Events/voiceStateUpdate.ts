import {Client, GuildMember, MessageEmbed, VoiceChannel, VoiceState} from "discord.js";
import { PrismaClient } from "@prisma/client";

module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState: VoiceState, newState: VoiceState, client: Client) {
        const prisma = new PrismaClient();
        try {
            if (newState.channelId == process.env.VOICECREATE!) {
                if (await prisma.temporaryVoice.findUnique({ where: { owner: newState.member?.id! }})){
                    let embed = new MessageEmbed()
                        .setAuthor({ name: newState.member?.displayName!, iconURL: newState.member?.avatarURL()! })
                        .setTitle("Channel Limit Erreicht!")
                        .setColor("RED")
                        .setDescription("Du hast bereits dein Channel Limit erreicht und kannst keine Weiteren mehr erstellen, solange du nicht deinen anderen Channel löschst!")
                        .setFooter({ text: "Avior", iconURL: newState.guild.iconURL()! });
                    await newState.member?.send({ embeds: [embed] });
                }else {
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
                }
            }else if (oldState.channel?.parent?.id == process.env.VOICECAT! && oldState.channel?.members.size == 0 && oldState.channel.id != process.env.VOICECREATE!){
                await oldState.channel.delete();
            }
        } catch (ex: any) {
            console.log(ex.toString())
        }
    }
}
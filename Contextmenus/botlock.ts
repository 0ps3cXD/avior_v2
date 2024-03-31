import { Client, ContextMenuInteraction, MessageEmbed } from "discord.js";
import { PrismaClient } from "@prisma/client";

module.exports = {
    name: "Bot Lock",
    type: "USER",
    async execute(interaction: ContextMenuInteraction, client: Client) {
        let authorid = interaction.user.id;
        let author = interaction.guild!.members!.cache.get(authorid)!;
        console.log(authorid + "\n" + author.roles.highest.id);
        if (!author?.roles.cache.some(role => role.id !== "1221431182479069216")){
            await interaction.reply({ content:"Du bist dazu nicht berechtigt!", ephemeral: true });
            return;
        }
        const prisma = new PrismaClient();
        let userid = interaction.targetId;
        let status = await prisma.locked.findUnique({ where: { id: userid }})
        if (status) {
            if (!status.locked) {
                await prisma.locked.update({ where: { id: userid }, data: { id: userid, locked: true}})
                try {
                    let embed = new MessageEmbed()
                    .setTitle("Du wurdest gesperrt!")
                    .setDescription("Du wurdest von unserem Team aus dem Bot-Netzwerk gesperrt!")
                    .setColor("RED")
                    .addFields([
                        { name: "Moderator", value: `<@${interaction.user.id}>`},
                    ])
                    .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                
                    let user = client.users.cache.get(userid);
                    await interaction.reply({ content: `User wurde gesperrt!`, ephemeral: true });
                    await user?.send({ embeds: [embed] });
                }catch (ex: any){
                    console.log(ex.toString());
                }
                
            }else {
                await prisma.locked.update({ where: { id: userid }, data: { locked: false }});
                try {
                    let embed = new MessageEmbed()
                    .setTitle("Du wurdest entsperrt!")
                    .setDescription("Deine Sperre gegenüber des Bot-Netzwerkes wurde aufgehoben!")
                    .setColor("GREEN")
                    .addFields([
                        { name: "Moderator", value: `<@${interaction.user.id}>`},
                    ])
                    .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                
                    let user = client.users.cache.get(userid);
                    await user?.send({ embeds: [embed] });
                    await interaction.reply({ content: `User wurde entsperrt!`, ephemeral: true });
                }catch (ex: any){
                    console.log(ex.toString());
                }
            }
    
        }else {
            await prisma.locked.create({
                data: {
                    id: userid,
                    locked: true
                }
            })
            try {
                let embed = new MessageEmbed()
                    .setTitle("Du wurdest gesperrt!")
                    .setDescription("Du wurdest von unserem Team aus dem Bot-Netzwerk gesperrt!")
                    .setColor("RED")
                    .addFields([
                        { name: "Moderator", value: `<@${interaction.user.id}>`},
                    ])
                    .setFooter({ text: "Avior", iconURL: interaction.guild?.iconURL()! })
                
                let user = client.users.cache.get(userid);
                await user?.send({ embeds: [embed] });
                await interaction.reply({ content: `User wurde gesperrt!`, ephemeral: true });
            }catch (ex: any){
                console.log(ex.toString());
            }
        }
    }
}
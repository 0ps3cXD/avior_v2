import { PrismaClient } from "@prisma/client";
import {Client, CommandInteraction, Interaction, MessageEmbed} from "discord.js";

module.exports = {
    name: "botlock",
    description: "Blockiert die Anfragen des Users an den Bot...",
    options: [
        { type: "target", name: "user", description: "User der gesperrt werden soll...", required: true },
        { type: "string", name: "reason", description: "Grund der Sperre", required: false }
    ],
    async execute(interaction: CommandInteraction, client: Client) {
        if (interaction.member!.permissions != "ADMINISTRATOR") return;
        const prisma = new PrismaClient();
        try {
            const target = interaction.options.getUser("user");
            let status = await prisma.locked.findUnique({where: {id: target?.id!}})
            if (status) {
                if (!status.locked) {
                    let reason = interaction.options.getString("reason") || "Kein Grund angegeben";
                    await prisma.locked.update({where: {id: target?.id!}, data: {id: target?.id!, locked: true}})
                    try {
                        let embed = new MessageEmbed()
                            .setAuthor({name: target?.username!, iconURL: target?.avatarURL()!})
                            .setTitle("Du wurdest gesperrt!")
                            .setDescription("Du wurdest von unserem Team aus dem Bot-Netzwerk gesperrt!")
                            .setColor("RED")
                            .addFields([
                                {name: "Moderator", value: `<@${interaction.user.id}>`},
                                {name: "Grund", value: reason}
                            ])
                            .setFooter({text: "Avior", iconURL: interaction.guild?.iconURL()!})

                        let user = client.users.cache.get(target?.id!);
                        await user?.send({embeds: [embed]});
                        await interaction.reply({content: `${target?.username} wurde gesperrt!`, ephemeral: true});
                    } catch (ex: any) {
                        console.log(ex.toString());
                    }

                } else {
                    await prisma.locked.update({where: {id: target?.id!}, data: {locked: false}});
                    try {
                        let embed = new MessageEmbed()
                            .setAuthor({name: target?.username!, iconURL: target?.avatarURL()!})
                            .setTitle("Du wurdest entsperrt!")
                            .setDescription("Deine Sperre gegenüber des Bot-Netzwerkes wurde aufgehoben!")
                            .setColor("GREEN")
                            .addFields([
                                {name: "Moderator", value: `<@${interaction.user.id}>`},
                            ])
                            .setFooter({text: "Avior", iconURL: interaction.guild?.iconURL()!})

                        let user = client.users.cache.get(target?.id!);
                        await user?.send({embeds: [embed]});
                        await interaction.reply({content: `${target?.username} wurde entsperrt!`, ephemeral: true});
                    } catch (ex: any) {
                        console.log(ex.toString());
                    }
                }

            } else {
                await prisma.locked.create({
                    data: {
                        id: target?.id!,
                        locked: true
                    }
                })
                let reason = interaction.options.getString("reason") || "Kein Grund angegeben";
                try {
                    let embed = new MessageEmbed()
                        .setAuthor({name: target?.username!, iconURL: target?.avatarURL()!})
                        .setTitle("Du wurdest gesperrt!")
                        .setDescription("Du wurdest von unserem Team aus dem Bot-Netzwerk gesperrt!")
                        .setColor("RED")
                        .addFields([
                            {name: "Moderator", value: `<@${interaction.user.id}>`},
                            {name: "Grund", value: reason}
                        ])
                        .setFooter({text: "Avior", iconURL: interaction.guild?.iconURL()!})

                    let user = client.users.cache.get(target?.id!);
                    await user?.send({embeds: [embed]});
                    await interaction.reply({content: `${target?.username} wurde gesperrt!`, ephemeral: true});
                } catch (ex: any) {
                    console.log(ex.toString());
                }
            }
        }catch (e) {
            console.log(e);
        }
    }
}
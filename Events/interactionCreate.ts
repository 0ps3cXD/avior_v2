import { PrismaClient } from "@prisma/client";
import {ButtonInteraction, Client, GuildMember, Interaction, MessageActionRow, MessageButton, MessageEmbed, Modal, ModalActionRowComponent, ModalSubmitInteraction, TextChannel, TextInputComponent} from "discord.js";
import fs from "fs";
import path from "path";
import { PasteClient, Publicity, ExpireDate } from "pastebin-api";

module.exports = {
    name: "interactionCreate",
    async execute(interaction: Interaction, client: Client) {
        const prisma = new PrismaClient();
        const pastebin = new PasteClient(process.env.PASTEBINKEY!);
        if (await prisma.locked.findUnique({ where: { id: interaction.user.id! }})) {
            await interaction.user.send("Du bist vom Bot-Netzwerk gesperrt!");
            return;
        }
        if (interaction.isContextMenu()) {
            const contextmenuFiles: string[] = fs.readdirSync(path.join(__dirname, "../Contextmenus")).filter(file => file.endsWith(".ts"));
            try {
                let formattedName = interaction.commandName.toLowerCase().trim().replace(' ', "");
                const contextmenu = require(path.join(__dirname, "../Contextmenus", formattedName));
                await contextmenu.execute(interaction, client);
            }catch(ex) {
                // @ts-ignore
                console.log(ex.toString());
                return;
            }
        }else if (interaction.isCommand()) {
            try {
                let commandname = interaction.commandName.toLowerCase().trim().replace(" ", "");
                const command = require(path.join(__dirname, "../Slashcommands", commandname));
                await command.execute(interaction, client);
            } catch (ex) {
                // @ts-ignore
                console.log(ex.toString())
                return;
            }
        }else if (interaction.isButton()) {
            let interact = interaction as ButtonInteraction;
            if (interact.customId == "openticket"){
                let modal = new Modal()
                .setTitle("Ticket erstellen")
                .setCustomId("ticket");

                let text = new TextInputComponent().setCustomId("ticketreason").setLabel("Grund des Tickets").setRequired(true).setPlaceholder("User Report").setStyle("SHORT")
                let row = new MessageActionRow<ModalActionRowComponent>().setComponents(text);
                modal.addComponents(row);
                await interact.showModal(modal);

            }else if (interact.customId == "delete"){
                await interaction.reply("Ticket wird gelöscht...");
                setTimeout(async() => { await interact.channel?.delete() }, 3000);

            }else if (interact.customId == "close") {
                await interact.reply("Ticket wird geschlossen...");
                let interactor = await prisma.ticket.findUnique({ where: { id: interact.channel?.id! }});
                let channel = await client.guilds.cache.get(process.env.GUILDID!)?.channels.cache.get(interact.channel?.id!) as TextChannel;
                await channel.setName(`closed-${interactor?.interactor!}`);
                await channel.permissionOverwrites.edit(interactor?.interactor!.toString()!, { VIEW_CHANNEL: false });
            
            }else if (interact.customId == "transcript"){
                await interact.reply("Transkript wird erstellt...");
                let channelContent = (await interact.channel?.messages.fetch()!);
                let content =  "";
                channelContent.reverse().forEach((message) => {content+=`${message.author.id} > ${message.content}\n`})
                const url = await pastebin.createPaste({
                    code: content,
                    expireDate: ExpireDate.Never,
                    format: "javascript",
                    name: `${(await prisma.ticket.findUnique({ where: { id: interact.channel?.id! } }))?.interactor}`,
                    publicity: Publicity.Public,
                  });
                let transchannel = interact.guild?.channels.cache.get(process.env.TICKETTRANS!) as TextChannel;
                await transchannel.send({ content: `Transkript für ein Ticket wurde erstellt!\n${url}`});
                await interact.user.send({ content: `Transkript für dein Ticket wurde erstellt!\n${url}`});

            }
        }else if (interaction.isModalSubmit()){
            let interact = interaction as ModalSubmitInteraction;
            const channel = await client.guilds.cache.get(process.env.GUILDID!)?.channels.create(`ticket-${interact.user.id!}`, {
                type: 'GUILD_TEXT',
                parent: process.env.TICKETCAT,
            });
            await channel?.permissionOverwrites.create(interact?.member as GuildMember, { VIEW_CHANNEL: true });
            let embed = new MessageEmbed()
                .setAuthor({ name: "Avior Ticket System", iconURL: client.user?.avatarURL()! })
                .setTitle("Ticket - " + interact.user.username)
                .setColor("AQUA")
                .addFields([
                    { name: "Ersteller", value: "<@" + interact.user.id + ">" }
                ])
                .setDescription("Anliegen: " + interact.fields.getTextInputValue("ticketreason"))
                .setTimestamp()
                .setFooter({ text: "Avior", iconURL: interact.guild?.iconURL()! });
            let actionrow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("delete")
                    .setLabel("Ticket löschen")
                    .setStyle("DANGER")
                    .setEmoji("🗑️"),
                    new MessageButton()
                    .setCustomId("close")
                    .setLabel("Schließen")
                    .setStyle("SECONDARY")
                    .setEmoji("🔒"),
                    new MessageButton()
                    .setCustomId("transcript")
                    .setLabel("Transkript erstellen")
                    .setStyle("SECONDARY")
                    .setEmoji("📝")
                )
            await channel?.send({ embeds: [embed], components: [actionrow] });
            await prisma.ticket.create({
                data: {
                    id: channel?.id!,
                    name: channel?.name!,
                    interactor: interact.user.id!
                }
            })
            await interact.reply({ content: "Ticket erstellt: <#" + channel?.id + ">", ephemeral: true });
        }
    },
}
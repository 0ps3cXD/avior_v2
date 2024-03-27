import {Client, Message} from "discord.js";

module.exports = {
    name: "test",
    description: "Test Command für Developer",
    async execute(client: Client, message: Message, args: string[]) {
        console.log("test")
    },
}
const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Message");

/**
 * @param {Discord.Message} message
 */
exports.execute = async (message) => {
    if(message.author.bot || message.content.startsWith(global.Settings.Prefix)) return;

    vt.add(`stats.${message.guild.id}.${message.author.id}.channels.${message.channel.id}`, 1);
    vt.set(`stats.${message.guild.id}.${message.author.id}.activity`, Date.now());
};

exports.conf = {
    event: "message"
};

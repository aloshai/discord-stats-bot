const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Voice");
const mdb = new Database("Database", "Message");
// exports.onLoad = (client) => {};
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {
    if(!message.member.permissions.has("ADMINISTRATOR") && !message.member.permissions.has("MANAGE_GUILD")) return message.reply("you are not permission to do this.");
    let deleteMessages = [];

    let msg = await message.reply("what data do you want to reset? `(all, voice and messages)` type one of these.");
    deleteMessages.push(msg);

    let reply = await message.channel.awaitMessages((m) => m.author.id == message.author.id, {
        time: 15000,
        max: 1
    }).then(messages => messages.first()).catch(err => undefined);
    if(!reply){
        message.reply("15 seconds have passed and you were unable to answer properly.")
        return delete_Messages(deleteMessages);
    }
    deleteMessages.push(reply);

    if(!["all", "voice", "messages"].some(type => reply.content.toLowerCase() == type)) return delete_Messages(deleteMessages);

    switch (reply.content) {
        case "all":
            vt.set(`stats.${message.guild.id}`, {});
            mdb.set(`stats.${message.guild.id}`, {});
            break;
        case "voice":
            vt.set(`stats.${message.guild.id}`, {});
            break;
        case "messages":
                mdb.set(`stats.${message.guild.id}`, {});
                break;
        default:
            vt.set(`stats.${message.guild.id}`, {});
            mdb.set(`stats.${message.guild.id}`, {});
            break;
    }
    delete_Messages(deleteMessages);
    message.reply(`\`${reply.content}\` info was successfully deleted.`).then(m => m.delete({timeout: 5000}));
};

exports.conf = {
    commands: ["rstats", "resetstat", "resetstats"],
    enabled: true,
    guildOnly: true
};

exports.help = { 
    name: 'me', 
    description: 'Sunucudaki aktifliğiniz hakkında bilgi verir.',
    usage: 'me',
    kategori: 'kullanıcı'
};

function delete_Messages(messages) {
    messages.forEach(message => {
        if(message.deletable && !message.deleted) message.delete().catch();
    });
}

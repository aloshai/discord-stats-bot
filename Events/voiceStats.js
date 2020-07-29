const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Voice");

const Activites = new Map();

/**
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
exports.execute = async (oldState, newState) => {
    if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
    if(!oldState.channelID && newState.channelID) { // This user has join the channel.
        Activites.set(oldState.id, Date.now());
    }
    let data;
    if(!Activites.has(oldState.id)){
        data = Date.now();
        Activites.set(oldState.id, data); // check current data for the existence of
    }
    else
        data = Activites.get(oldState.id);
    let duration = Date.now() - data;
    if(oldState.channelID && !newState.channelID) { // This user has left the channel.
        Activites.delete(oldState.id);
        vt.add(`stats.${oldState.guild.id}.${oldState.id}.channels.${oldState.channelID}`, duration);
        vt.set(`stats.${oldState.guild.id}.${oldState.id}.activity`, Date.now());
    }
    else if(oldState.channelID && newState.channelID){ // This user has changes the channel.
        Activites.set(oldState.id, Date.now());
        vt.add(`stats.${oldState.guild.id}.${oldState.id}.channels.${oldState.channelID}`, duration);
        vt.set(`stats.${oldState.guild.id}.${oldState.id}.activity`, Date.now());
    }
};

exports.conf = {
    event: "voiceStateUpdate"
};

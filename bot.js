const client = global.client;

client.on("ready", () => {
    console.log("Bot is ready!");
});

client.login(global.Settings.Token);
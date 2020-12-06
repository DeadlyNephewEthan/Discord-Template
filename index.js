//Discord:  !̷̧̟  Nekoyasha#2189
//Website: https://www.nekoyasha.ga
console.clear();
const Discord = require("discord.js");
const NekoyashaClient = require("./struct/nekoyasha");
let client = new NekoyashaClient({
  disableMentions: "everyone",
  autoReconnect: true,
  disabledEvents: ["TYPING_START"],
  partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION"],
});
client.start(client.config.token, "./struct/commands", "./struct/events");
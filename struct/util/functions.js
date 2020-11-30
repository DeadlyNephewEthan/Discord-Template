/**
 *  @params {Client} client
 *  @params {Message} message
 */
const Discord = require("discord.js");
const color = require("../../storage/color.json");

module.exports = {
  error: function (channel, text) {
    let errorEmbed = new Discord.MessageEmbed()
      .setColor(color.red)
      .setDescription(`\\📛 **Error :** ${text}`);
    channel.send(errorEmbed).then((m) => m.delete({ timeout: 6000 }));
  },

  success: function (channel, text) {
    let successEmbed = new Discord.MessageEmbed()
      .setColor(color.green)
      .setDescription(`\\✅ **Success :** ${text}`);
    channel.send(successEmbed).then((m) => m.delete({ timeout: 6000 }));
  },
};

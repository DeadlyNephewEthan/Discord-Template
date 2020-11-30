/**
 *  @params {Client} client
 *  @params {Message} message
 *  @params {String[]} args
 */
const { stripIndents } = require('common-tags');

exports.run = async (client, message, args) => {
  try {
    message.delete({
      timeout: 5000,
      reason: "It had to be done.",
    }); // Put your Code Here.
   const msg = await message.channel.send('Pinging...');
    const timeDiff = (msg.editedAt || msg.createdAt) - (message.editedAt || message.createdAt);
    message.channel.send(stripIndents(`
            🔂 **Ping**: ${timeDiff} ms
            💟 **Heartbeat**: ${Math.round(client.ws.ping)} ms
        `));
  } catch (err) {
    // End of the Code.
    client.functions.error(
      message.channel,
      `An error occurred while running the command:\n\` ${err.name}: ${err.message} \`
                `
    );
  }
};
exports.help = {
  name: "ping",
  description: "Get latency details!",
  examples: "",
  usage: "",
};
exports.conf = {
  aliases: ["latency"],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
exports.requirements = {
  owner: false,
  bot: [],
  user: [],
};

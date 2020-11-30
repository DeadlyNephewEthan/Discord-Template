/**
 *  @params {Client} client
 *  @params {Message} message
 *  @params {String[]} args
 */
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  try {
    message.delete({
      timeout: 5000,
      reason: "It had to be done.",
    }); // Put your Code Here.
    const embed = new Discord.MessageEmbed();
    embed.setColor(client.color.none);
    let cmd = args[0];
    // If the user type the [command], also with the aliases.
    let command =
      client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (command) {
      if (command.help.usage) {
        embed.setTitle(`\`${command.help.name} ${command.help.usage || ""}\``);
      } else {
        embed.setTitle(`\`${command.help.name}\``);
      }
      embed.addField("❯ Description", command.help.description);
      if (command.conf.aliases.length)
        embed.addField(
          "❯ Aliases",
          command.conf.aliases.map((alias) => `\`${alias}\``).join(" ")
        );
      if (command.help.examples.length)
        embed.addField(
          "❯ Examples",
          command.help.examples.map((example) => `\`${example}\``).join("\n")
        );
    } else {
      let categories = client.helps.array();
      // This will hide a folder from display that includes "hide: true" in their module.json
      if (!client.config.owner.user)
        categories = client.helps.array().filter((x) => !x.hide);
      embed.setAuthor(
        `${client.user.username} Bot`,
        client.user.displayAvatarURL()
      );
      embed.setDescription(
        `For additional info on a command, use \`${client.config.prefix}help <command>\``
      );
      for (const category of categories) {
        embed.addField(
          `❯ ${category.name}`,
          category.cmds.map((c) => `\`${c}\``).join(" ")
        );
      }
    }
    message.channel.send({
      embed: embed,
    });
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
  name: "help",
  description: "Display a list of all available commands!",
  examples: ["help ping"],
};
exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
exports.requirements = {
  owner: false,
  bot: [],
  user: [],
};

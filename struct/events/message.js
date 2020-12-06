/**
 *  @params {Client} client
 *  @params {Message} message
 */
const Discord = require("discord.js"),
  cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
  message.channel.messages.fetch();
  
  prefix = client.config.prefix;

  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    message.reply(new Discord.MessageEmbed().setColor(client.color.green).setAuthor(`My Prefix is  ${prefix} , to get started; type ${prefix}help`, message.author.displayAvatarURL({dynamic:true})));
  }
  // Start fetching commands
  if (message.author.bot ||
    message.author === client.user ||
    !message.guild ||
    message.channel.type === "dm"
  )return;
const mentionedPrefix = RegExp(`<@!?${client.user.id}> ?|^${prefix}`),
  matchedPrefix = message.content.match(mentionedPrefix);
if (!matchedPrefix) return;
const args = message.content.slice(matchedPrefix[0].length).trim().split(/ +/);
 const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.get(client.aliases.get(commandName));
  
  if (!command) {
    const tagName = message.content.slice(matchedPrefix.length);
    console.log("No command got send here");
  } else {
    //Check Owner Permission
    if (
      command.requirements.owner &&
      command.requirements.owner === true &&
      !client.config.owner.bot.includes(message.author.id)
    )
      return client.functions.error(
        message.channel,
        "Sorry, only the developer of the bot is allowed to use this command."
      );
    //Check Bot Permission
    if (
      command.requirements.bot &&
      command.requirements.bot.length > 0 &&
      !message.guild.me.hasPermission(command.requirements.bot)
    )
      return client.functions.error(
        message.channel,
        `Sorry, I don't have the permissions \`${message.guild.me.permissions
          .missing(command.requirements.bot)
          .join(", ")
          .replace(/_/gi, " ")}\`.`
      );
    //Check Users Permission
    if (
      command.requirements.user &&
      command.requirements.user.length > 0 &&
      !message.member.hasPermission(command.requirements.user)
    )
      return client.functions.error(
        message.channel,
        `Sorry, you don't have the permissions \`${message.member.permissions
          .missing(command.requirements.user)
          .join(", ")
          .replace(/_/gi, " ")}\`.`
      );
    //Run Commmands
    let sender = message.author;
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    let commandFile =
      client.commands.get(commandName) ||
      client.commands.get(client.aliases.get(commandName));
    if (!commandFile) return;
    if (!cooldowns.has(commandFile.help.name))
      cooldowns.set(commandFile.help.name, new Discord.Collection());
    const member = message.member,
      now = Date.now(),
      timestamps = cooldowns.get(commandFile.help.name),
      cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;
    if (!timestamps.has(member.id)) {
      if (!client.config.owner.user) {
        timestamps.set(member.id, now);
      }
    } else {
      const expirationTime = timestamps.get(member.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
     return message.reply(
      new Discord.MessageEmbed().setColor(client.color.red)
      .setTitle(`❌ Please wait \`${timeLeft.toFixed(1)} seconds\` before reusing the \`${prefix}${command.name}\`!`)    
     );
      }
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    }
    try {
    message.channel.startTyping();
    setTimeout(function(){
    message.channel.stopTyping();

      if (!commandFile) return;
      commandFile.run(client, message, args);
}, 1000);
    } catch (err) {
      return client.functions.error(
        message.channel,
        `An error occurred while running the command: \n${err.name}: ${err.message}`
      );
    } finally {
      console.log(`(${sender.id}) ran a command: ${commandName}`);
    }
  }
};

const { Client, Collection, Intents, Message } = require("discord.js"),
  fs = require("fs");

var admin = require("firebase-admin");

var serviceAccount = require("../storage/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nekoysha.firebaseio.com"
});

module.exports = class NekoyashaClient extends (
  Client
) {
  constructor() {
    super();
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.aliases = new Collection();
    this.event = new Collection();
    this.helps = new Collection();
    this.config = new require("../storage/config.js");
    this.color = new require("../storage/color.json");
    this.database = new admin.firestore();
    this.functions = new require("../struct/util/functions.js");
  }

  getMentions() {
    const client = this.client;

    return {
      member(mention, guild) {
        if (!mention) return;
        const matches = mention.match(/<@!?(\d{17,19})>/);
        const memberID = matches ? matches[1] : mention;
        return guild.members.cache.get(memberID);
      },
      async user(mention) {
        if (!mention) return;
        const matches = mention.match(/<@!?(\d{17,19})>/);
        const userID = matches ? matches[1] : mention;
        return await client.users.fetch(userID).catch(() => null);
      },
      channel(mention, guild) {
        if (!mention) return;
        const matches = mention.match(/<#(\d{17,19})>/);
        const channelID = matches ? matches[1] : mention;
        return guild.channels.cache.get(channelID);
      },
      role(mention, guild) {
        if (!mention) return;
        const matches = mention.match(/<@&(\d{17,19})>/);
        const roleID = matches ? matches[1] : mention;
        return guild.roles.cache.get(roleID);
      },
    };
  }
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  trimArray(arr, number) {
    if (arr.length > number) {
      const len = arr.length - number;
      arr = arr.slice(0, number);
      arr.push(`${len} more...`);
    }

    return arr;
  }

  removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  start(token, cmdPath, eventPath) {
    this.login(token);
    fs.readdir(`${cmdPath}/`, (err, categories) => {
      this.commands = new Collection();
      this.cooldowns = new Collection();
      this.aliases = new Collection();
      this.helps = new Collection();
      if (err) console.log(err); // it will send you an error, if there was something went wrong.
      console.log(`Found total ${categories.length} categories.`);
      categories.forEach((category) => {
        let moduleConf = require(`.${cmdPath}/${category}/module.json`);
        moduleConf.path = `${cmdPath}/${category}`;
        moduleConf.cmds = [];
        if (!moduleConf) return; // If there was no module.json in the folder, return.
        this.helps.set(category, moduleConf);
        fs.readdir(`${cmdPath}/${category}`, (err, files) => {
          // Example: Found total 19 command(s) from admin.
          console.log(
            `Found total ${files.length - 1} command(s) from ${category}.`
          );
          if (err) console.log(err);
          let commands = new Array();
          files.forEach((file) => {
            if (!file.endsWith(".js")) return; // If the file wasn't ended with .js, ignore it.
            let prop = require(`.${cmdPath}/${category}/${file}`);
            let cmdName = file.split(".")[0];
            this.commands.set(prop.help.name, prop);
            prop.conf.aliases.forEach((alias) => {
              this.aliases.set(alias, prop.help.name);
            });
            this.helps.get(category).cmds.push(prop.help.name);
            // This will push the data into Collection, which is includes name of the file, aliases, and many.
          });
        });
      });
    });
    const events = fs.readdirSync(`${eventPath}/`);
    for (let event of events) {
      let file = require(`.${eventPath}/${event}`);
      this.on(event.split(".")[0], (...args) => file(this, ...args));
      // This will remove the .js and only with the name of the event.
    }
  }
};

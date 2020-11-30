/**
 *  @params {Client} client
 *  @params {Message} Message
 */

module.exports = (client, message) => {
  try {
    function randomStatus() {
      let status = [
        `${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`,
        `Ping me for commands`,
      ];
      let rstatus = Math.floor(Math.random() * status.length);

      let types = ["WATCHING"];
      let rtypes = Math.floor(Math.random() * types.length);

      client.user.setActivity(status[rstatus], {
        type: types[rtypes],
        url: "https://facebook.com/lapizherda",
      });
    }
    setInterval(randomStatus, 10000);
    console.log(
      `
███╗   ██╗███████╗██╗  ██╗ ██████╗ ██╗   ██╗ █████╗ ███████╗██╗  ██╗ █████╗ 
████╗  ██║██╔════╝██║ ██╔╝██╔═══██╗╚██╗ ██╔╝██╔══██╗██╔════╝██║  ██║██╔══██╗
██╔██╗ ██║█████╗  █████╔╝ ██║   ██║ ╚████╔╝ ███████║███████╗███████║███████║
██║╚██╗██║██╔══╝  ██╔═██╗ ██║   ██║  ╚██╔╝  ██╔══██║╚════██║██╔══██║██╔══██║
██║ ╚████║███████╗██║  ██╗╚██████╔╝   ██║   ██║  ██║███████║██║  ██║██║  ██║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝                                                                 
\n${client.user.tag} Discord Bot is now online.\nBot Invite: https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n`
    );
  } catch (err) {
    return console.log(`An error occurred while running the command: ${err.name}: ${err.message}
 				`);
  }
};

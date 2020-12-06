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
\nLogged in as ${client.user.tag} in ${Math.floor(
			process.uptime() * 1000
		)}ms`
	);
	client.postLoad();
    } catch (err) {
        return console.log(`An error occurred while running the command: ${err.name}: ${err.message}
 				`);
    }
};
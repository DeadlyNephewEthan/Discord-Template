// Files
const config = require("./config.js");
const util = require("./util.js");
const route = require("./route.js");

// Startup

// Modules
const Discord = require('discord.js');
const fetch = require("node-fetch");
const http = require("http");
const url = require("url");
module.exports = function(client) {
    const description = {
            name: "Nekoyasha",
            filename: "server.js",
            version: "0.1"
        }
        //log that the module is loaded
    console.log(` :: ⬜️ Website: ${description.name} | Loaded version ${description.version} from ("${description.filename} ")`)
        //Put your Code Below
    // HTTP server

    const server = http.createServer((req, res) => {
        // Access-Control-Allow headers

        res.setHeader("Access-Control-Allow-Origin", "*")

        // Handle requests

        if (req.method === "GET") {
            console.log(`[Website] Someone is clicking... https://${req.headers.host}${req.url}`);
            
            if (req.headers["x-forwarded-proto"] === "http") {
                // Redirect to HTTPS

                res.writeHead(301, {
                    Location: `https://${req.headers.host}${req.url}`
                })
                res.end()
            } else {
                // Route request

                route(url.parse(req.url).pathname).then(response => {
                    if (response.code === 200) {
                        // Content-Type

                        if (response.mimeType) {
                            res.setHeader("Content-Type", response.mimeType)
                        }

                        // Response

                        res.writeHead(200)
                        res.write(response.data)
                        res.end()
                    } else if (response.code === 301 || response.code === 302) {
                        // Redirect

                        res.writeHead(response.code, {
                            Location: response.redirect
                        })
                        res.end()
                    } else if (response.code === 404) {
                        // 404

                        util.read_file("public/errors/404.html").then(file => {
                            res.writeHead(404)
                            res.write(file)
                            res.end()
                        })
                    } else {
                        // Response

                        res.writeHead(response.code)
                        res.write(response.data)
                        res.end()
                    }
                })
            }
        } else if (req.method === "POST") {
            // Collect data

            let data = ""
            req.on("data", chunk => {
                if (!req.aborted) {
                    data += chunk.toString()
                    if (data.length > config.reqByteLimit) {
                        // Request too large

                        res.writeHead(400)
                        res.write("ERROR: REQUEST TOO LARGE")
                        res.end()

                        req.aborted = true
                    }
                }
            })

            // Data collected

            req.on("end", () => {
                if (!req.aborted) {
                    // HANDLE POST REQUESTS HERE

                    console.log("Post request received:", data)
                }
            })
        } else {
            // Invalid request

            res.writeHead(400)
            res.write("ERROR: INVALID REQUEST")
            res.end()
        }
    }).listen(config.port)

    function pong() {
        fetch(`https://${config.replit_url}`);

        console.log(`Pinging: https://${config.replit_url}`);
    } setInterval(pong, 60000);
    
    server.on("listening", () => {
        util.log(`HTTP server listening on port ${config.port}`)
    })
}

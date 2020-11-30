const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
  res.sendStatus(400);
});

app.use(express.static(__dirname));
app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/src/404.html");
});

function pong() {
  fetch("https://yourwebsite.com");

  console.log("Website Ping");
}

setInterval(pong, 60000);

module.exports = () => {
  // listen for requests | Don't change this
  const listener = app.listen(process.env.PORT, () => {
    console.log("Listening on PORT " + listener.address().port);
  });
};

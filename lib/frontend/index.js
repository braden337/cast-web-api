const path = require("path");
const Express = require("express");
const app = (module.exports = Express());
const internalIp = require("internal-ip");

const local_ip = internalIp.v4.sync();

app.use(Express.static(path.join("/home/pi", "cast_frontend")));

app.get("/ip", function(req, res) {
  res.json({ ip: local_ip });
});

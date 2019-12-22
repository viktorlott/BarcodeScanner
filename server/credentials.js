const fs = require("fs")

const key = fs.readFileSync(__dirname + "/../certs/selfsigned.key");
const cert = fs.readFileSync(__dirname + "/../certs/selfsigned.crt");
const options = {
  key: key,
  cert: cert
}
module.exports = options
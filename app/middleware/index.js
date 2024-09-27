const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");

console.log("index "+authJwt+" roles "+verifySignUp);
module.exports = {
  authJwt,
  verifySignUp
};
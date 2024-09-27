const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
console.log("controller  "+controller);
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  console.log("app post signin ");
  app.post("/api/auth/signin", controller.signin);
  console.log("app post signout ");
  app.post("/api/auth/signout", controller.signout);
};
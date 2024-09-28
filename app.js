
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

const db = require("./app/models");
const Role = db.role;
console.log("db use "+db+" role "+Role);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
console.log("app use "+app);

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], 
    httpOnly: true,
  })
);



db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});


// route
console.log("apppppp "+app);
app.get("/", (req, res) => {
  res.json({ message: "Welcome all" });
  console.log("welcome app "+app);
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });
  }
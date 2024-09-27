const db = require("../models");
const config = require("../config/auth.config")
const User = db.user;
const Role = db.role;

const Op= db.Sequelize.Op;

const jwt = require("jsonwebtoken")
const bcrypt =require("bcryptjs")
console.log("auth contoller js "+User);
console.log("auth contoller js "+Role);

exports.signup = async (req,res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]:req.body.roles,
                    },
                },
            });

            const result = user.setRoles(roles);
            console.log("ress if "+result);
            if (result) res.send({ message: "User registered successfull"});
        }
        else {
            const result = user.setRoles([1]);
            console.log("ress els "+result);
            if (result) res.send({ message: "user registered successful" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message});
        }   
    };
exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
            },
        });
        console.log("user not found  mes "+user);
        if(!user) {
            return res.status(404).send({ message: "User not found"});
            console.log("user not found "+user);
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        console.log("password valid "+passwordIsValid);
        if (!passwordIsValid) {
          console.log("password valid "+passwordIsValid);
            return res.status(401).send({
              message: "Invalid Password!",
            });
          }
      
        const token = jwt.sign({ id: user.id },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, 
            });
      
          let authorities = [];
          const roles = await user.getRoles();
          console.log("roles get roles "+roles);
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }
      
          req.session.token = token;
          console.log("roles get roles "+req.session.token);
          return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
          });
        } catch (error) {
          return res.status(500).send({ message: error.message });
        }
      };
      
      exports.signout = async (req, res) => {
        try {
          console.log(" request session "+req.session);
          req.session = null;
          return res.status(200).send({
            message: "You've been signed out!"
          });
        } catch (err) {
          this.next(err);
        }
      };
      
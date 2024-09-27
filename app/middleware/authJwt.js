const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models")
const User = db.user;
console.log("authjwt "+User);
verifyToken = (req, res, next) => {
    let token = req.session.token;
    console.log("token use "+token);
    if(!token) {
        return res.status(403).send({
            message: "no token provided",
        });
    }

   
    jwt.verify(token,config.secret,(err, decoded) => {
       
        if (err) {
            return res.status(401).send({
                message: "unauthorised",
            });
        }



        req.userId = decoded.id;
        console.log("token use in auth jwttttt: "+req.userId);
        next();
    });
};

isAdmin = async (req,res,next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        console.log("isadmin "+user+" roles "+roles);
        for(let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                return next();
            }
        }
    
    return res.status(403).send({
        message: "admin required",
    });
} catch (error) {
    return res.status(500).send({
        message: "unable to validate user role",
    });
}
};

isModerator = async (req,res,next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        console.log("ismodereator "+user+" roles "+roles);
        for (let i=0;i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
        }

        return res.status(403).send({
            message: "moderator required",
        });
    } catch (error) {
        return res.status(500).send({
            message: "unable to validate moderator role",
        });
    }
};

isModeratorOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        console.log("ismodoradmin "+user+" roles "+roles);
        for(let i=0; i < roles.length; i++) {
            if(roles[i].name === "moderator") {
                return next();
            }

            if (roles[i].name === "admin") {
                 return next();
            }
        }

        return res.status(403).send({
            message: "moderator or admin required",
        });
    } catch (error) {
        return res.status(500).send({
            message: "unable to validate moderaotr or admin",
        });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
};
console.log("auth jwt "+authJwt);
module.exports = authJwt;
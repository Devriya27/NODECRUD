exports.allAccess = (req, res) => {
    res.status(200).send("Public ");
    console.log("status 1 "+res.status)
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content");
    console.log("status 2 "+res.status)
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin ");
    console.log("status 3 "+res.status)
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator ");
    console.log("status 4 "+res.status)
  };


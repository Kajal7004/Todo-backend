const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    console.log("token",token)
    
   const splitToken = token.split(" ")[1];


//console.log("Token after split:", token);


 
    const decoded = jwt.verify(splitToken, process.env.JWT_SECRET);
    console.log("decoded",decoded)
    req.user = decoded;
    console.log("req from middleware",req.body);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};



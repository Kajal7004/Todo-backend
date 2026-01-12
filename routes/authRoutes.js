const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router(); // 

// REGISTER
router.post("/register", async (req, res) => {     
  try {
    console.log("REQ BODY 👉", req.body);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.log("REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {

    console.log("JWT_SECRET 👉", process.env.JWT_SECRET);
    console.log("JWT_REFRESH_SECRET 👉", process.env.JWT_REFRESH_SECRET);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //Access Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2m" }
    );

    //Refresh Token
    const ref_token = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "10m"}
    );

    res.json({ 
      access_token : token,
      refresh_token: ref_token
    });

    
  } catch (error) {
    console.log("LOGIN ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

//REFRESH TOKEN
router.post("/refresh-token",async(req, res) =>{
  const { refresh_token } = req.body;
  
  if(!refresh_token) {
    return res.status(401).json({ message: "Refresh token required"});

  }
  try{
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      {id: decoded.id},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    res.json({ access_token: newAccessToken });
  }catch (error) {
    res.status(403).json({ message: "Invalid refresh token"}); 
  }
})

module.exports = router;

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("./../Middlewares/UserAuth");
require("dotenv").config();
let refreshTokens = [];
//Access tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5s",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);
};
//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User(req.body);
    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    const email = req.body.email;
    const passwords = req.body.password;
    const user = await User.FindByCredentials(email, passwords);
    if (!user) {
      res.json({message: 'Not Found'});
    }else{
      const { password, updatedAt, ...other } = user._doc;
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: other,
      });
    }
    
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/refresh", async (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  //console.log(decoded);
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  const user = await User.findOne({ _id: decoded.id });

  if (!user) return res.status(404).json("Cant found user");

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});
router.get("/get", Auth, async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({ user });
  } catch (e) {
    //Nếu có error !important thì xuất status(500)
    res.status(500).send({
      message: "internal server error",
    });
  }
});
module.exports = router;

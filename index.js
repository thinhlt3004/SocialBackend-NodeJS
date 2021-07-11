const express = require("express");
const app = express();
const mongoose = require("mongoose");

const helmet = require("helmet");
const morgan = require("morgan");
//Upload file with Multer
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const indexRouter = require('./routes/index');
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const notificationsRoute = require("./routes/notifications");
const groupConversationRoute = require("./routes/groupconversation");
const sharePostRoute = require("./routes/sharepost");
const router = express.Router();
const path = require("path");
const dotenv = require("dotenv");
const cors = require('cors')
require("dotenv").config();
require('./db/connection');
app.use(cors())
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(express.urlencoded({ extended: false }));

    //this is for test Nodemon
    //cb(null, file.originalname);
    //this is for app
    // console.log(req.body);
    //console.log(req.body.name);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post("/api/uploads", upload.single("file"), (req, res) => {
  
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});
const storagePerson = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/person");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadPerson = multer({ storage: storagePerson });
app.post("/api/uploads/person", uploadPerson.single("file"), (req, res) => {
  
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/conversations", conversationRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/groupconversation",groupConversationRoute);
app.use("/api/sharepost",sharePostRoute);
app.use('/', indexRouter);


app.listen(8800, () => {
  console.log("Backend server is running!");
});

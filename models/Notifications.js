const mongoose = require("mongoose");

const NotificationsSchema = new mongoose.Schema(
  {
    receiverId: {
      type: String,
      // required: true,
    },
    senderId: {
        type: String,
       // required: true,
    },
    PostId: {
        type: String,
        //required: true,
    },
    likes: {
        type: Boolean,
        default: false,
    },
    comments: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
        //required: true,
    },
    read:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("notifications", NotificationsSchema);

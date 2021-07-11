const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
      default: "",
    },
    feeling: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    creater:{
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);

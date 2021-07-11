const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      trim: true, 
      default: "",
      // required: true
    },
    coverPicture: {
      type: String,
      trim: true, 
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);
UserSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) user.password = bcrypt.hashSync(user.password, 8)
  next()
});

UserSchema.statics.FindByCredentials = async function (email, password) {
    
  try {
    user = await User.findOne({email: email});
    if(!user) throw new Error('Invalid username');
    isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid password');

    return user;
  } catch (error) {
    console.log(error);
  }
};

User  = mongoose.model('users', UserSchema);

module.exports = User;

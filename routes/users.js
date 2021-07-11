const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const Auth = require('./../Middlewares/UserAuth');
const Friendship = require('./../models/Friendship');
//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});
router.get('/getall',Auth, async (req, res, next) => {
    const currentUser = req.user;
    let suggestList = [];
    const users = await User.find({});
    users.map(user => {
    if(!currentUser.friends.includes(user._id) && user._id !== currentUser._id){
        suggestList.push(user);
      }
    })
    for(let i = 0; i < suggestList.length; i++){
      if(suggestList[i].username === currentUser.username){
        suggestList.splice(i, 1);
      }
    }
    res.json(suggestList);
})
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try{
    const user = userId 
    ? await User.findById(userId)
    : await User.findOne({username: username});   
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.json({err: err.message});
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.friends.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});
router.put('/:id/profilePicture', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if(!user){
        res.status(404).json({message: 'Not Found'});
      }
      user.profilePicture = req.body.img;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(err);
    }

});

router.put('/:id/coverPicture', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user){
      res.status(404).json({message: 'Not Found'});
    }
    user.coverPicture = req.body.img;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(err);
  }

});

router.get('/find/:username', async (req, res) => {
    try {
      const username = req.params.username.toLowerCase();

      const user = await User.find({username: new RegExp('.*'+username+'.*', 'i')});
      if(!user){
        res.status(404).json({message: 'Not Found'});
      }
      let arr = [];
      user.map(user =>{
        const { password, updatedAt, ...other } = user._doc;
        arr.push(other);
      })
      //const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(arr);
    } catch (error) {
      res.status(500).json(error);
    }

});

router.post('/sendrequest', async (req, res) => {
  try {
    const newFriendShip = new Friendship();
    newFriendShip.senderId = req.body.senderId;
    newFriendShip.receiverId = req.body.receiverId;
    await newFriendShip.save();
    res.status(200).json(newFriendShip);
  } catch (error) {
    res.status(500).json(error);
  }

})

router.put('/sendrequest/:id/status/:status', async (req, res) => {
  try {    
    if(req.params.status === '3'){
      const friendRequest =  await Friendship.deleteOne({_id: req.params.id});
      res.status(200).json(friendRequest);
    }else{
      const friendRequest = await Friendship.findById(req.params.id);
      friendRequest.status = req.params.status;
      const sender = await User.findById(friendRequest.senderId);
      const receiver = await User.findById(friendRequest.receiverId);
      await sender.updateOne({ $push: { friends: receiver._id } });
      await receiver.updateOne({ $push: { friends: sender._id } });
      await friendRequest.save();
      res.status(200).json(friendRequest, sender, receiver)
    }
  } catch (error) {
    res.status(500).json(error);
  }

})

router.get('/:userId/getrequest', async (req, res) => {
    try {
      const friendRequest = await Friendship.find({receiverId : req.params.userId, status: 2});
      // if(!friendRequest){
      //   res.status(404).json({message: 'Not Found'});
      // }
      res.status(200).json(friendRequest);
    } catch (error) {
      res.status(500).json(error);
    }
})

router.get('/getStatus/:senderId/:receiverId', async (req, res) => {
  try {
    const friendRequest = await Friendship.findOne(
      {
        receiverId : req.params.receiverId,
        senderId : req.params.senderId
      }
    );
    // if(!friendRequest){
    //   res.status(404).json({message: 'Not Found'});
    // }
    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;

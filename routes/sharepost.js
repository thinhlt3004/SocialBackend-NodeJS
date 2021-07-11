const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.post('/:createrId/:currentUserId', async (req, res)=> {
    try {
      const newPost = new Post();      
      if(req.body.desc){
        newPost.desc = req.body.desc;
      }
      if(req.body.type){
        newPost.type = req.body.type;      
      }
      if(req.body.img){
        newPost.img = req.body.img;
      }
      if(req.body.feeling){
        newPost.feeling = req.body.feeling;
      }
      if(req.body.location){
        newPost.location = req.body.location;
      }
      newPost.userId = req.params.currentUserId;
      newPost.creater = req.params.createrId;
      await newPost.save();
      res.status(200).json(newPost);
    } catch (error) {
      res.status(500).json(error);
    }
})




module.exports = router;
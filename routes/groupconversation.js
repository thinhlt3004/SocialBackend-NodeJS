const router = require("express").Router();
const GroupConversation = require("../models/GroupConversation");


router.get("/:userId", async (req, res) =>{
    try {
        const groupCon = await GroupConversation.find({member : { $in :[ req.params.userId]}});
        if(!groupCon){
            res.status(404); //
        }
        res.status(200).json(groupCon);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get("/getConversation/:conId", async (req, res) =>{
    try {
        const groupCon = await GroupConversation.findById(req.params.conId);
        if(!groupCon){
            res.status(404); //
        }
        res.status(200).json(groupCon);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post("/", async (req, res) =>{
   try {
        const newGroupCon = new GroupConversation();
        newGroupCon.createrId = req.body.createrId;
        newGroupCon.groupName = req.body.groupName;
        newGroupCon.member = [req.body.createrId];
        if(req.body.groupImg){
            newGroupCon.groupImg = req.body.groupImg;
        }
        await newGroupCon.save();
        res.status(200).json(newGroupCon);
   } catch (error) {
       res.status(500).json(error);
   }

})

router.put("/:groupId/:friendId", async (req, res) => {
    try {
        const group = await GroupConversation.findById(req.params.groupId);
        if(!group){
            res.status(404);
        }
        const update = await group.updateOne({ $push :  { member: req.params.friendId } });
        res.status(200).json(update);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post("/:groupId/setImage", async (req, res) => {
    try {
        const group = await GroupConversation.findById(req.params.groupId);
        if(!group){
            res.status(404);
        }
        group.groupImg = req.body.img;
        await group.save();
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json(error);
    }

});

module.exports = router;
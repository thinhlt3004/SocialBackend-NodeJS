const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new Conversation
router.post('/', async (req, res) =>{
    const newConversation = new Conversation({
        member : [req.body.senderId, req.body.receiverId]
    })

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        res.status(500).json(error);
    }
})

//get Conversation of a user
router.get('/:userId', async (req, res) =>{
    try {
        const conversation = await Conversation.find({
            member: {$in : [req.params.userId]}
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/findOne/:conversationId', async (req, res) =>{
    try {
        const conversation = await Conversation.findById(req.params.conversationId);        
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/find/:firstUserId/:SecondUserId', async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            member: {$all : [req.params.firstUserId,req.params.SecondUserId]}
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router;
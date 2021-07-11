const router = require("express").Router();

const Notifications = require("./../models/Notifications");


router.post('/', async (req, res) =>{
    try{
        console.log(req.body);
        const newNotifications = new Notifications();
        newNotifications.receiverId = req.body.receiverId;
        newNotifications.senderId = req.body.senderId;
        newNotifications.PostId = req.body.postId;
        if(req.body.comments){
            newNotifications.comments = req.body.comments;
        }else if(req.body.likes){
            newNotifications.likes = req.body.likes;
        }
        if(req.body.text){
            newNotifications.text = req.body.text;
        }
        if(req.body.read){
            newNotifications.read = req.body.read;
        }
        const Notification = await newNotifications.save();
        res.status(200).json(Notification);
    }catch(e){
        res.status(500).json(e);
    }
});


router.get('/:receiverId/unread', async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        const notification = await Notifications.find({receiverId: receiverId, read: false}).sort({createdAt: -1});
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/:receiverId/readed', async (req, res) => {
    try {
        const receiverId = req.params.receiverId;      
        const notification = await Notifications.find({receiverId: receiverId, read: true}).sort({createdAt: -1});
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json(error);
    }
})


router.put('/:notificationId', async (req, res) => {
    try{
        const notification = await Notifications.findOne({_id: req.params.notificationId});
        notification.read = true;
        notification.save();
        res.status(200).json(notification);
    }catch(e){
        res.status(500).json(e);
    }
 });
module.exports = router;
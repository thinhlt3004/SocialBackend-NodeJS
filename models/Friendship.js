const mongoose = require("mongoose");

const FriendShipSchema = new mongoose.Schema(
    {
        senderId: {
            type: String
        },
        receiverId: {
            type: String
        },
        status:{
            type: Number,
            enum: [1, 2, 3],
            default: 2
        }
    },{
        timestamps: true
    }
    
);

module.exports = mongoose.model("Friendships", FriendShipSchema);
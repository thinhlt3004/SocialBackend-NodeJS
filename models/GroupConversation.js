const mongoose = require("mongoose");

const GroupConversationSchema = new mongoose.Schema(
    {
        createrId: {
            type: String,
            require: true,          
        },
        groupName: {
            type: String,
            require: true,          
        },
        groupImg: {
            type: String,
            default: "",
        },
        member: {
            type: Array,
            default: [],
        },
    },{
        timestamps: true
    }
    
);

module.exports = mongoose.model("GroupConversations", GroupConversationSchema);
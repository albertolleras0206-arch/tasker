const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "done", "awaiting", "in-progress"],
        default: "pending"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        requiered: true
    }
}, {Timestamp:true});

module.exports = mongoose.model("Task", taskSchema);
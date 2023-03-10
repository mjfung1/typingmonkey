const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    cpm: Number,
    wpm: Number,
    mistakes: Number,
    name: {
        type: String,
        default: "Anonymous"
    }
}, {timestamps: true});


module.exports = mongoose.model("User", UserSchema);
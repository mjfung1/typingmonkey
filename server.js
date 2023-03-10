const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const fns = require('date-fns');
const app = express();
require("dotenv").config();


const User = require("./model/user");


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to mongo database"))
    .catch((err) => console.log("Error connecting to DB"));

mongoose.set("strictQuery", false);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {

    if (req.cookies.name) {
        return res.redirect("/game");
    } 
    res.render("index");
})

app.post("/", async (req, res) => {
    const { name = "Anonymous" } = req.body;
    res.cookie("name", name);
    res.redirect("/game");

    
})

app.get("/game", async (req, res) => {
    if (!req.cookies.name) {
        return res.redirect("/")
    }
    let users = await User.find({}).sort({wpm: -1}).limit(6);
    const usersFormatted = []
    users.forEach(user =>  usersFormatted.push( {_id:user._id, cpm:user.cpm, wpm:user.wpm, mistakes:user.mistakes, name:user.name, createdAt: fns.formatDistanceToNow(new Date(user.createdAt), {addSuffix: true}) } ))

    res.render("game", { users: usersFormatted, user: req.cookies.name });
});

app.post("/game", async (req, res) => {
    const { wpm, cpm } = req.body;
    if ( wpm > 5 && cpm > 5) {
        const user = new User(req.body);
        user.name = req.cookies.name;
        await user.save();
    }

    res.redirect("/");
    
})


app.listen(3000, () => console.log("listening of port 3000"));
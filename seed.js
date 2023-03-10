const mongoose = require("mongoose");
const User = require("./model/user");

mongoose
    .connect("mongodb://localhost:27017/typingMonkey")
    .then(() => console.log("Connected to mongo database"))
    .catch((err) => console.log("Error connecting to DB"));

mongoose.set("strictQuery", false);

const users = [
    {name: "Sophie", mistakes: 3, wpm: 25, cpm: 140 },
    {name: "Ethan", mistakes: 2, wpm: 45, cpm: 120 },
    {name: "Diego", mistakes: 6, wpm: 35, cpm: 110 },
    {name: "Dylan", mistakes: 4, wpm: 25, cpm: 90 },
    {name: "Liam", mistakes: 7, wpm: 35, cpm: 79 },
]

const seedDB = async (users) => {
    await User.deleteMany({});
    await User.insertMany(users);
};

seedDB(users).then(() => {
    console.log("Database seeded");
    mongoose.connection.close();
});
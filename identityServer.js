const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const users = {
    "9876543210": 2003,
    "9123456789": 2015
};

app.post("/get-dob", (req, res) => {
    const { phone } = req.body;

    const birthYear = users[phone];

    if (!birthYear) {
        return res.json({ error: "User not found" });
    }

    res.json({ birthYear });
});

app.listen(4000, () => {
    console.log("Identity server running on port 4000");
});
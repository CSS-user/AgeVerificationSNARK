const express = require("express");
const cors = require("cors")
const snarkjs = require("snarkjs");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.options("/verify-age", cors());
app.post("/verify-age", async (req, res) => {

    const { proof, publicSignals } = req.body;

    try {

        const vKey = JSON.parse(
            fs.readFileSync("outputs/verification_key.json")
        );

        const verified = await snarkjs.groth16.verify(
            vKey,
            publicSignals,
            proof
        );

        res.json({
            verified: verified && publicSignals[0] == "1"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
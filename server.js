const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let keys = [];

/* 🔑 GENERATE KEY */
app.post('/generate-key', (req, res) => {
    const { duration } = req.body;

    const random = Math.random().toString(36).substring(2,9).toUpperCase();
    const key = "HAMZI-" + random;

    const expiry = Date.now() + (duration * 1000);

    keys.push({ key, expiry });

    res.json({ key, expiry });
});

/* ✅ VERIFY KEY */
app.post('/verify-key', (req, res) => {
    const { key } = req.body;

    const found = keys.find(k => k.key === key);

    if(!found){
        return res.json({ valid:false });
    }

    if(Date.now() > found.expiry){
        return res.json({ valid:false, expired:true });
    }

    res.json({ valid:true });
});

/* 🔥 IMPORTANT FOR RENDER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running on port " + PORT));
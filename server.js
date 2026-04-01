const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let keysDB = []; // memory storage

// 🔑 GENERATE KEY
app.post('/generate-key', (req, res) => {
    const { duration } = req.body;

    const key = "HAMZI-" + Math.random().toString(36).substring(2, 9).toUpperCase();

    const expiry = Date.now() + (duration * 1000);

    keysDB.push({
        key,
        expiry
    });

    res.json({ key, expiry });
});

// 🔐 VERIFY KEY
app.post('/verify-key', (req, res) => {
    const { key } = req.body;

    const found = keysDB.find(k => k.key === key);

    if (!found) return res.json({ valid: false });

    if (Date.now() > found.expiry) {
        return res.json({ valid: false });
    }

    res.json({ valid: true, expiry: found.expiry });
});

// 📋 GET ALL KEYS
app.get('/keys', (req, res) => {
    res.json(keysDB);
});

// ❌ DELETE KEY
app.delete('/delete/:key', (req, res) => {
    keysDB = keysDB.filter(k => k.key !== req.params.key);
    res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));

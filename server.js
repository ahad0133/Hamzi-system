const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

/* 🧠 MEMORY DATABASE */
let keys = [];

/* 🔐 LOGIN */
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "123456") {
        return res.json({ success: true });
    }

    res.json({ success: false });
});

/* 🔑 GENERATE KEY */
app.post('/generate-key', (req, res) => {
    const { duration } = req.body;

    if (!duration) return res.json({ error: "Duration required" });

    const key = "HAMZI-" + Math.random().toString(36).substr(2, 7).toUpperCase();
    const expiry = Date.now() + (Number(duration) * 1000);

    keys.push({ key, expiry });

    res.json({ key });
});

/* 🔍 VERIFY KEY */
app.post('/verify-key', (req, res) => {
    const { key } = req.body;

    const found = keys.find(k => k.key === key);

    if (!found) {
        return res.json({ valid: false });
    }

    if (Date.now() > found.expiry) {
        return res.json({ valid: false });
    }

    res.json({
        valid: true,
        expiry: found.expiry
    });
});

/* 📋 GET ALL KEYS */
app.get('/keys', (req, res) => {
    res.json(keys);
});

/* ❌ DELETE KEY */
app.delete('/delete/:key', (req, res) => {
    const keyParam = req.params.key;

    keys = keys.filter(k => k.key !== keyParam);

    res.json({ success: true });
});

/* 📊 STATS */
app.get('/stats', (req, res) => {
    const now = Date.now();

    const total = keys.length;
    const active = keys.filter(k => k.expiry > now).length;
    const expired = keys.filter(k => k.expiry <= now).length;

    res.json({ total, active, expired });
});

/* 🧹 CLEAR EXPIRED */
app.post('/clear-expired', (req, res) => {
    const now = Date.now();

    keys = keys.filter(k => k.expiry > now);

    res.json({ success: true });
});

/* 🌐 ROOT CHECK */
app.get('/', (req, res) => {
    res.send("HAMZI SERVER RUNNING 🚀");
});

/* 🚀 START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

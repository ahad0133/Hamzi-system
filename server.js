const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

/* 🗄️ TEMP MEMORY (reset on restart) */
let keys = [];

/* 🔑 GENERATE KEY */
app.post('/generate-key', (req, res) => {

    const { duration } = req.body; // seconds

    if(!duration){
        return res.json({ error: "Duration required" });
    }

    // 🔐 RANDOM KEY
    const random = Math.random().toString(36).substring(2,9).toUpperCase();
    const key = "HAMZI-" + random;

    // ⏳ EXPIRY TIME
    const expiry = Date.now() + (duration * 1000);

    // 💾 SAVE
    keys.push({ key, expiry });

    res.json({
        key,
        expiry
    });
});

/* 🔍 VERIFY KEY */
app.post('/verify-key', (req, res) => {

    const { key } = req.body;

    const found = keys.find(k => k.key === key);

    if(!found){
        return res.json({ valid:false });
    }

    if(Date.now() > found.expiry){
        return res.json({ valid:false, expired:true });
    }

    // ✅ RETURN EXPIRY FOR TIMER
    res.json({
        valid:true,
        expiry: found.expiry
    });
});

/* 🧹 OPTIONAL: CLEAN EXPIRED KEYS */
setInterval(()=>{
    const now = Date.now();
    keys = keys.filter(k => k.expiry > now);
}, 60000); // every 1 min

/* 🌐 RENDER PORT FIX */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let keys=[];

/* LOGIN */
app.post('/login',(req,res)=>{
const {username,password}=req.body;

if(username==="admin" && password==="123456"){
return res.json({success:true});
}

res.json({success:false});
});

/* GENERATE */
app.post('/generate-key',(req,res)=>{
const {duration}=req.body;

const key="HAMZI-"+Math.random().toString(36).substr(2,7).toUpperCase();
const expiry=Date.now()+duration*1000;

keys.push({key,expiry});

res.json({key});
});

/* GET KEYS */
app.get('/keys',(req,res)=>{
res.json(keys);
});

/* DELETE */
app.delete('/delete/:key',(req,res)=>{
keys=keys.filter(k=>k.key!==req.params.key);
res.json({ok:true});
});

/* STATS */
app.get('/stats',(req,res)=>{
const now=Date.now();

const total=keys.length;
const active=keys.filter(k=>k.expiry>now).length;
const expired=keys.filter(k=>k.expiry<=now).length;

res.json({total,active,expired});
});

/* CLEAR */
app.post('/clear-expired',(req,res)=>{
const now=Date.now();
keys=keys.filter(k=>k.expiry>now);
res.json({ok:true});
});

app.listen(3000,()=>console.log("Server running"));

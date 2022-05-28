const User= require("../models/user")
const router = require("express").Router();
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
// Register
router.get('/data',async (req,res)=>{
    try{
        const data = await User.find();
        res.send(data);
    }
    catch (e)
    {
        res.send(e);
    }
});
router.post("/register",async (req,res)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const password= await bcrypt.hash(req.body.password,salt);
        const user= await new User({
            username:req.body.username,
            email:req.body.email,
            password:password,
        });
        const u = await user.save();
        res.json(u);
        console.log(user);
    }
    catch (e){
        res.status(500).json(e);
    }
});

router.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({
            email:req.body.email,
        });
        !user && res.status(404).send("user not found");
        const valiPassword=await bcrypt.compare(req.body.password,user.password)
        !valiPassword && res.status(400).json("wrong password")
    }
    catch(e)
    { 
        res.status(500).json(e);
    }
});
module.exports = router;
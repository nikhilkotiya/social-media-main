const router = require("express").Router();
const User = require("../models/user")
const bcrypt = require("bcrypt");

router.get("/:id",async (req,res)=>{
    try{
        const user =  await User.findById(req.params.id);
        const {password,updatedAt,createdAt,isAdmin, ...other }=user._doc
        res.status(200).json(other);
    }
    catch(e)
    {
        res.status(500).json(e);
    }
})
router.delete("/:id", async (req,res)=>
{
    if( req.body.userid === req.params.id)
    {
        try{
            const user= await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account Deleted");
        }
        catch(e)
        {
            res.status(500).send("Wrong user id 1");
        }
    }
    else{
        res.status(500).send("Wrong user id 2");
    }
});
router.put("/:id", async (req,res)=>
{
    if( req.body.userid === req.params.id)
    {
        if(req.body.password)
        {
            console.log(req.body.password);
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            catch (e)
            {
                console.log(req.body.password);
                return res.status(500).json("ERROR");
            }
        }
        try{
            const user= await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(200).json("Account Updated");
        }
        catch(e)
        {
            res.status(500).send("Wrong user id 1");
        }
    }
    else
    {
        res.status(500).send("Wrong user id 2");
    }
});
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId !== req.params.id)
    {
        try{
            const user = await User.findById(req.params.id);
            const curruser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId))
            {
                await user.updateOne({$push:{followers:req.body.userId}});
                await curruser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("User has been followed!");
            }
            else
            {
                res.status(403).json("You already follow");
            }
        }
        catch(e)
        {
            res.status(500).json(e);
        }
    }
    else{
        res.status(403).json("You can't follow yourself");
    }
});
router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId !== req.params.id)
    {
        try{
            const user = await User.findById(req.params.id);
            const curruser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId))
            {
                await user.updateOne({$pull:{followers:req.body.userId}});
                await curruser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("User has been unfollowed!");
            }
            else
            {
                res.status(403).json("You are not following this user");
            }
        }
        catch(e)
        {
            res.status(500).json(e);
        }
    }
    else{
        res.status(403).json("You can't unfollow yourself");
    }
});
module.exports = router
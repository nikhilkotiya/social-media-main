const router= require("express").Router();
const req = require("express/lib/request");
const Post = require("../models/post")

router.post("/create/:id",async (req,res)=>{
    try 
    {
        if(req.params.id === req.body.user)
        {
            const newpost = await new Post(req.body);
            const save=await newpost.save();
            res.status(200).json(save);
        }   
        else
        {
            res.json("You cann;t post for other user");
        }
    } 
    catch (error) {
        res.status(500).json(error);
    }
});

router.put("/edit/:id",async (req,res)=>{
    try 
    {   
        const post = await Post.findById(req.params.id);
        if(post.user === req.body.userID)
        {
            await post.updateOne({$set:req.body});
            res.status(200).json("Post Updated");
        }
        else
        {
            res.json("You cann;t post for other user");
        }   
    } 
    catch (error) {
        res.status(500).json(error);
    }
});
router.delete("/delete/:id",async (req,res)=>{
    try 
    {   
        const post = await Post.findById(req.params.id);
        if(post.user === req.body.userID)
        {
            await post.delete();
            res.status(200).json("Post deleted");
        }
        else
        {
            res.json("You can only delete your post");
        }   
    } 
    catch (error) {
        res.status(500).json(error);
    }
});
router.put("/like/:id",async(req,res)=>
{
    try
    {
        const post = await Post.findById(req.params.id);
        if(req.body.user !== post.user)
        {
            if(!post.likes.includes(req.body.user))
            {
                await post.updateOne({$push:{likes:req.body.user}});
                res.status(200).json("Post has been liked");
            }
            else{
                await post.updateOne({$pull:{likes:req.body.user}});
                res.status(200).json("Post has been unliked");
            }
        }
        else
        {
            res.status(404).json("You cann't like you own post");
        }
    }
    catch(error)
    {
        res.status(500).json(error);
    }
});
router.get("/:id",async(req,res)=>
{
    try 
    {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);    
    } 
    catch (error) 
    {
        res.status(404).json(error);
    }
});
router.get("/timeline",async(req,res)=>
{
    let postArray=[];
    try{
        const curruser = await User.findById(req.body.userID);
        const userPosts = await Post.find({user: curruser._id});
        const friendPosts = await Promise.all(
            curruser.following.map((friendId)=>{
                return Post.find({user:friendId});
            })
        );
        res.json(userPosts.concat(...friendPosts));
    }  
    catch(error)
    {
        res.status(404).json(error)
    }
});
module.exports = router
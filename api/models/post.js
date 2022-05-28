const mongoose=require("mongoose")

const post =  new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:500,
    },
    img:{
        type:String,
    },
    likes:{
        type:Array,
        default:[]
    },
},
{timestamps:true} 
);


module.exports =  mongoose.model("Post",post);
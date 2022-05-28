const mongoose=require("mongoose")
const users=new mongoose.Schema({

    username:{
        type : String,
        required:true,
        min:5,
        max:40,
        unique:true
    },
    email:{
      type:String,
      required:true,
      max:49,
      unique:true  
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
    profile_pic:{
        type:String,
        default:"",
    },
    followers:{
        type:Array,
        default:[],
    },
    following:{
        type:Array,
        default:[],
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50
    }
},
{timestamps:true}
);

module.exports =  mongoose.model("User",users)
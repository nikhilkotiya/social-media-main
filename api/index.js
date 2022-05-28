const express = require("express");

const app = express();
const mongoose = require("mongoose");
const dotenv=require("dotenv");
const morgan=require("morgan"); 
const helmet=require("helmet");
const userRoute = require("./routes/user")
const userAuth = require("./routes/auth")
const post = require("./routes/post")
dotenv.config();
app.use(express.json());
// middleware
// app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user",userRoute);
app.use("/api/auth",userAuth);
app.use("/api/post",post);
app.get("/",(req,res)=>
{
    res.send("Welcome to homepage")
})
app.get("/user",(req,res)=>
{
    res.send("Welcome to User  page")
})
mongoose.connect(
    process.env.DB,
    { useUnifiedTopology : true,useNewUrlParser:true },
    ()=> console.log("connected to db")
);
app.listen(8800,()=>
{
    console.log("serve is running")
})
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const app = express()

app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))





mongoose.connect("mongodb://localhost:27017/userDB",{useUnifiedTopology:true, useNewUrlParser:true})

const userSchema = new mongoose.Schema({
    username:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]})


const User = new mongoose.model("user",userSchema)





app.get("/", function(req,res){
    res.render("home")
})

app.get("/login", function(req,res){
    res.render("login")
})
app.post("/login", function(req,res){
    User.findOne({username:req.body.username}, function(err,user){
        if(err){
            console.log(err)
        }else{
            if(user){
                if(user.password === req.body.password){
                    res.render("secrets")
                    console.log("welcome "+user.username);
                }else{
                    console.log("Wrong password! Try again.");
                }
            }else{
                console.log("No user found!");
            }
        }
    })
})




app.get("/register", function(req,res){
    res.render("register")
})
app.post("/register", function(req,res){
    const newUser = new User({
        username:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(!err){
            console.log("user data saved")
            res.render("secrets")
        }else{
            console.log(err);
        }
    })

})



app.get("/secrets", function(req,res){
    res.render("secrets")
})









app.listen(3000, function(){
    console.log("running on server 3000...");
})
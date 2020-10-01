const express= require("express");
const app = express();
const port = 8000;

const admin = (req,res) =>{
    res.send("This is to be admin");
}

const isAdmin = (req,res,next) =>{
    console.log("isAdmin is runing");
    next()
}

const isloggedIn = (req,res,next) =>{
    console.log("isloggedIn is running");
    next()
}

app.get('/admin',isloggedIn,isAdmin,admin);


app.get('/',(req,res)=>{
    res.send("This is the Home Page");
})

app.get('/login', (req,res)=>{
    res.send("Welcome to the login page");
})

app.get('/signout', (req,res) => {
    res.send("You are signed out")
})

app.get('/sanambedi',(req,res) =>{
    res.send("He uses instagram")
})

app.get("/signup",(req,res) => {
    res.send("You are signed up");
})

app.listen(port, ()=>{
    console.log("Server is up and running...");
})
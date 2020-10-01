require('dotenv').config()
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth') //Iss  ko import kiya gya hai.
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")



//DB Connection
mongoose.connect(process.env.DATABASE, {    //Here, process is where it attaches all depoendencies          //Environment is the file that we have created   //DATABASE is the variable that we have provided
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
}).then(()=>{
    console.log("DB CONNECTED")
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes

app.use("/api",authRoutes);
/* Jab bhi yaha koi visit karega to uska main visitng auth file mein moujood route se hoyegi.. Aage fir jo raah per woh batayega ussi raah per yeh chalega*/
/* Yaha per jaise pehle aa raha tha ki jo likha hai whi per show ho jaayega per abb aisa nahi raha kyoki humne
    yaha per routing ka proyog kiya haiisliye jo hum yaha per pehle define karenge jaise api. Usse waha per likhna
    hi padhega */
app.use("/api",userRoutes);
// PORT
app.use("/api",categoryRoutes);

app.use("/api",productRoutes);

app.use("/api",orderRoutes);

const port = process.env.PORT || 8000;

//Starting a server
app.listen(port,()=>{
    console.log(`App is running at Port Number ${port}`)
})
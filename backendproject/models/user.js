const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxlength : 32,
        trim : true
    } ,
    lastname : {
        type :String,
        maxlength : 32,
        trim :true
    },
    email:{
        type : String,
        trim : true,
        required : true,
        unique : true
    },
    userinfo : {
        type: String,
        trim: true
    },
    encry_password : {
        type : String,
        required : true
    },
    salt : String,
    role : {
        type : Number,
        default : 0
    },
    purchases : {
        type : Array,
        default : []
    }
},{timestamps : true})

userSchema.virtual("password")
    /* Virtual ke do mukhya ang hote hai getters and setter . Abb hum unko documentation mein se likhenge*/
    .set(function(password){ //Yeh password upar virtual mein pass kiya tha
        this._password =  password;  //Yaha per '_' isliye use kiya hai kyoki password yaha per ek private variable hai
        this.salt = uuidv1();    //Password encrypt ho jaayega
        this.encry_password = this.securePassword(password); //Abb yeh yaha per reffer kar raha hai neeche method ko 
    })                      //Yeh sab documentation mein se mill jaayega
    .get(function(){
        return this._password;
    });                      //Yeh sab documentation mein se mill jaayega


userSchema.methods ={

    authenticate: function(plainpassword){     //Function to authenticate password
        return this.securePassword(plainpassword) === this.encry_password  //securePassword(plainpassword input waala hai aur encry_password database waala)
    },    

    securePassword : function(plainpassword){
        if(!plainpassword)
        {
            return "";
        }
        try
        {
            return crypto.createHmac('sha256', this.salt)  //Yaha per pehle secret likha tha per humne yaha per salt isliye likh diya kyoki hum yaha per apni technique use kar rahe hai encrypt karne ki... 
            .update(plainpassword)       //Yaha per brackets mein plane password isliye aaya kyoki hum yaha per pass hi plainpassword kar rahe hai.
            .digest('hex');              /* Yeh sab documentation ka kamaal hai kisi ko 
            yaad nahi rehti itni sabb cheeze, Yeh likhne ke liye crypto node.js ki documentation padhni padhegi.
            Sab mil jaayega */
        }
        catch(err)
        {
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema)
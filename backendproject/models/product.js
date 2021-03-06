const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema ; // Yeh yaha per destructuring ka code likha hai

const productSchema = new Schema({
    name : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32
    }, 
    description : {
        type : String,
        trim : true,
        required : true,
        maxlength : 2000
    },
    price : {
        type : Number,
        required : true,
        maxlength : 32,
        trim : true
    },
    category : {
        type : ObjectId,
        ref : "Category", /* Yaha per yeh field import ki gyi hai kyoki isse pehle category.js se export kiya gya tha*/ 
        required : true
    },
    stock : {
        type : Number
    },
    sold : {
        type : Number,
        default : 0
    },
    photo : {
        data : Buffer,
        contentType : String
    }
},{timestamps : true})





module.exports = mongoose.model("Product",productSchema)
const mongoose = require("mongoose");
const { stringify } = require("uuid");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new Schema({
    product : {
        type : ObjectId,
        ref : "Product"
    }, 
    name : {
        type: String
    },    
    count : {
        type : Number
    }, 
    price : {
        type: Number
    },
     
})

const ProductCart = mongoose.model("ProductCart",ProductCartSchema )

const orderSchema = new Schema({
    products : [ProductCartSchema],    //Yaha per product cart schema khaali choda hai dhyaan se. Abhi isse baad mein define karenge]
    transaction_id : {},
    amount : {
        type : Number
    },
    address : {
        type : String,
        maxlength : 200
    },
    status :{
        type: String,
        default : "Recieved",
        enum : ["Cancelled","Deleivered","Shipped","Processing","Recieved"],
    },
    updated : {
        type : Date,
    },
    user : {
        type : ObjectId,
        ref : "User",
        required : true
    }
},{timestamps : true})


const Order = mongoose.model("Order", orderSchema)

module.exports = {Order,ProductCart} 
const User = require("../models/user");
const Order = require("../models/order")

exports.getUserById = (req,res,next,id) =>{
    User.findById(id).exec((err,user) =>{
        if(err || !user){
            return res.status(400).json({
                Error : "No user was found"
            })
        }
        req.profile = user;
        next();
    })
}

exports.getUser = (req,res)=>{
    //TODO get here for password
    req.profile.salt = undefined;
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined
    return res.json(req.profile)
}
exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new:true , useFindAndModify : false},
        (err,user)=>{
            if(err || !user){
                return res.status(400).json({
                    Error : "You are not authorized to update this information"
                })  
            }
            user.salt = undefined;
            user.encry_password = undefined
            user.createdAt = undefined;
            user.updatedAt = undefined
            res.json(user)
        }
    )
}
exports.userPurchaseList = (req,res) =>{
    Order.find({user : req.profile._id})
    .populate("user","id_name ")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                Error : "No Order in this account"
            })
        }
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req,res,next)=>{
    let purchases = []
    req.body.order.products.array.forEach(product => {
        purchases.push({
            _id: product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id
        })
    });

    //Store it in DB


    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push : {purchases: purchase}},
        {new : true},
        (err,purchases)=>{
            if(err)
            {
                return res.status(400).json({
                    error : "Unable to save Purchase list"
                })
            }
            next();
        })
}
const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")
const { sortBy } = require("lodash")


exports.getProductById = (req,res,next,id) =>{
    Product.findById(id).populate("category").exec((err,product)=>{
        if(err){
            return res.status(400).json({
                Error : "Product doesn't exists"
            })
        }
        req.products = product;
        next()
    })
}

exports.createProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err ,fields,file)=>{
        if(err){
            return res.status(400).json({
                Error : "Problem with image"
            })
        }
        //Destructure the fields
        const {name,description,price,category,stock} = fields;

        if(
            !name ||
            !description ||
            !price ||
            !category || 
            !stock
        ){
            return res.status(400).json({
                Error : "Please include all fields" 
            })
        }

        let product = new Product(fields)

        //Handle the file here
        if(file.photo){
            if(file.photo.size > 3145728){
                return res.status(400).json({
                    Error : "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //Save to the DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    Error : "Saving tshirt in DB failed"
                })
            }
            res.json(product)
        })
    })
}

exports.getProduct = (req,res) =>{
    req.product.photo = undefined
    return res.json(req.product)
}

exports.photo = (req,res,next) =>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.deleteProduct = (req,res) =>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                Error : "Failed to delete the product"
            })
        }
        res.json({
            message : "Deletion was a success",
            deletedProduct
        })
    })
}


exports.updateProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err ,fields,file)=>{
        if(err){
            return res.status(400).json({
                Error : "Problem with image"
            })
        }
        //updation code

        let product = req.product
        product = _.extend(product, fields)

        //Handle the file here
        if(file.photo){
            if(file.photo.size > 3145728){
                return res.status(400).json({
                    Error : "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //Save to the DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    Error : "Updation of product failed"
                })
            }
            res.json(product)
        })
    })
}

//product listing
exports.getAllProducts = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                Error : "No Product Found"
            })
        }
    })
}

exports.getAllUniqueCategories = (req,res) =>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                Error : "No category found"
            })
        }
        res.json(category)
    })
}

exports.updateStock = (req,res,next) =>{
    let myOperations = req.body.order.products.map(prod =>{
        return {
            updateOne: {
                filter : {_id : prod._id},
                update : {$inc : {stock: -prod.count , sold : +prod.count}}//Yeh sab bulk write ki documentation ka part hai
            }
        }
    });
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                Error : "Bulk Operation Failed "
            })
        }
        next()
    })
}


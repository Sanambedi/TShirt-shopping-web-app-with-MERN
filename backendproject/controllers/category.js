const Category = require("../models/category")

exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,cate)=>{
        if(err){
            return res.status(400).json({
                Error : "Category not found in DB"
            })
        }
        req.category = cate;
        next()
    })  
    
}
exports.createCategory = (req,res)=>{
    const category = new Category(req.body)
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                Error : "Not able to save in DB"
            })
        }
        res.json({ category })
    });
};

exports.getCategory = (req,res) =>{
    return res.json(req.category)
}

exports.getAllCategory = (req,res) =>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                Error : "No Categories Found",
            })
        }
        res.json(categories)
    })
}

exports.updateCategory = (req,res) =>{
    const category = req.category;
    category.name = req.body.name;
    
    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                Error : "Failed to update Category"
            })
        }
        res.json(updatedCategory)
    })
}
exports.removeCategory = (req,res) =>{
    const category = req.category;
    category.remove((err,category) =>{
        if(err){
            return res.status(400).json({
                Error : "Failed to delete this category"
            })
        }
        res.json({
            message : `Successfully Deleted category ${category}`
        })
    })
}
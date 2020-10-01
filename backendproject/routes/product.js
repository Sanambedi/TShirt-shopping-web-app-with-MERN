const express = require("express");
const router = express.Router();

const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth") 
const {getUserById} = require("../controllers/user") 
const {getProductById, getProduct,createProduct,photo,updateProduct,deleteProduct,getAllProducts,getAllUniqueCategories} = require("../controllers/product");

//all of params
router.param("userId",getUserById)
router.param("productId",getProductById)
//all of actual routes
//Create Rouute
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct)

//Read Routes
router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId",photo)
//Delete Route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct)

//Update Route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct)


//Listing Route
router.get("/products",getAllProducts)


router.get("/products/categories",getAllUniqueCategories)

module.exports = router;

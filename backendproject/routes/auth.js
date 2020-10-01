var express = require('express')
var router = express.Router()
const {signout, signup ,signin, isSignedIn} = require("../controllers/auth")

const { check,validationResult } = require('express-validator');

//Doing signout routing

router.post("/signup",
[
    check("name","Name should be at least 3 character").isLength({ min: 3 }),
    check("email","Email is required").isEmail(),
    check("password","Password field is required").isLength({min : 3}),
],signup);
router.post("/signin",
[
    check("email","Email is required").isEmail(),
    check("password","Password should be atleast 3 character").isLength({min : 3}),
],signin);


router.get("/signout",signout)
router.get("/testroute",isSignedIn,(req,res)=>{
    res.send("It's a protected route")
})






//End mein isko export kiya gya hai
module.exports = router;
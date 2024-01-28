const express =require("express")
const router =express.Router()
const {setProduct,getProduct} = require('../controller/productController')
const passport = require("passport")
// const {
//     verifyToken,
//     // verifyTokenAndAdmin
//   } = require("./verifyToken");
// router.post('/', setUser)
// router.get('/users/admin/:email',verifyToken,getAdmin)
// router.get('/',verifyToken, getAllUser)
// router.patch('/users/admin/:id',verifyToken, makeAdmin)
// router.get('/users/admin/', makeAdmin)


router.post('/add',setProduct)
router.get('/list',getProduct)

// router.post('/forgot-password',forgetPassword)
// router.post('/reset-password/:token',resetPassword)
// router.post('/login', passport.authenticate('local'), login)


module.exports = router;
const express =require("express")
const router =express.Router()
const {setProduct,getProduct,getProductDetails,getProductDelete,updateProduct,SearchProductByName} = require('../controller/productController')
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
router.get('/list/:id',getProductDetails)
router.delete('/list/:id',getProductDelete)
router.put('/list/update/:id',updateProduct)
router.get('/list/search/:name',SearchProductByName)
// router.post('/forgot-password',forgetPassword)
// router.post('/reset-password/:token',resetPassword)
// router.post('/login', passport.authenticate('local'), login)


module.exports = router;
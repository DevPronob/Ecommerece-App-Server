// pronobroy3601
// kMpQ910CUkvawTCa

const express =require("express")
const router =express.Router()
const {getCart} = require('../controller/cartController')
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

router.get('/list',getCart)

// router.post('/add',setCategory)
// router.get('/list',getCategory)
// router.put('/list/update/:id',updateCategory)
// router.post('/forgot-password',forgetPassword)
// router.post('/reset-password/:token',resetPassword)
// router.post('/login', passport.authenticate('local'), login)


module.exports = router;
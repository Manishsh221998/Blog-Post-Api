const express=require('express')
const authController = require('../controller/authController');
const AuthCheck = require('../middleware/authCheck');
const profileImage = require('../helper/imageUpload');
const imageUpload=require('../helper/imageUpload')
const router=express.Router()
 
 
router.post('/register',imageUpload.single('image'),authController.registerUser)
router.post('/login',authController.loginUser)
router.get('/verify-email/:id/:token',authController.verifyEmail)

router.use(AuthCheck)
router.get('/profile',authController.profile)
router.put('/update-profile',profileImage.single('image'),authController.updateProfile)


module.exports=router
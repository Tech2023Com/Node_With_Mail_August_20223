const express  =  require('express')
const router  =  express.Router()
const UserControllers =  require('../Controllers/UserControllers')

router.get('/welcome' , UserControllers.getWelcomeCustomer)
router.post('/add-user' ,UserControllers.addUser  )
router.post('/login-user' ,UserControllers.login  )
router.post('/send-mail' ,  UserControllers.sendMail)
router.post('/forgot-password' ,  UserControllers.forgotPassword)
router.post('/verify-otp' ,  UserControllers.VerifyOtp)


module.exports = router;
const express  =  require('express')
const router  =  express.Router()
const AdminControllers =  require('../Controllers/AdminControllers')


router.get('/welcome' ,AdminControllers.getWelcomeAdmin  )
module.exports = router
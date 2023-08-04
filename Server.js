const express = require('express');
const app  = express()
const PORT =  9091
const db =  require('./DB/Db')
const UserRoutes  =  require('./Routes/UserRoutes')
const AdminRoutes  =  require('./Routes/AdminRoutes')
const bodyparser  = require('body-parser')
const cors  = require('cors')

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended :  true}))


app.use('/admin' , AdminRoutes)
app.use('/user' , UserRoutes)




app.listen(PORT , ()=>{
    console.log(`Server is Running on PORT : ${PORT}`)
})
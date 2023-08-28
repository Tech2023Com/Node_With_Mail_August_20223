const UserSchema  = require('../Schemas/UserSchema');
const OtpSchema  = require('../Schemas/Otp')
const bcrypt  = require('bcrypt')
const nodemailer = require("nodemailer");
const User = require('../Schemas/UserSchema');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'webt5987@gmail.com',
      pass: 'qvpgatbokowxmxns'
    }
  });

exports.getWelcomeCustomer  =  (req,res) =>{
    res.status(200).send('Hi Welcome Customer')

}

exports.sendMail  =  (req,res)=>{

    transporter.sendMail({
        from: '"Fred Foo 👻" <webt5987@gmail.com>', // sender address
        to: "bhanu.chouhan021@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      }).then((result)=>{
        console.log(result);
        res.send("hi")
      }).catch((err)=>{
        console.log(err)
        res.send("bye")
      })
}



exports.VerifyOtp = (req,res) =>{
   const {email ,  otp   , n_pass} =  req.body

   UserSchema.find({email :  email}).then((r1)=>{
      if(r1.length >  0)
      {
            var u_id =  r1[0]._id

            console.log(u_id)

            OtpSchema.find({  uid : u_id }).then((r2)=>{
                if(r2.length > 0 )
                {


                    if(otp == r2[0].otp)
                    {

                          
                            if((Number(new Date(Date.now))   -  Number(r2[0].time)) >  60000   )
                            {
                                res.status(401).send({status : 401  , message :"OTP has expired"})
                            }
                            else
                            {   

                                    bcrypt.genSalt(10 ,  function(err , salt){
                                        if(err){
                                            res.status(500).send({status : 500  , message :"Something Went Wrong"})

                                        }
                                        else
                                        {
                                            bcrypt.hash(n_pass ,  salt ,  function(err,hash){

                                                if(err){
                                                    res.status(500).send({status : 500  , message :"Something Went Wrong"})
        
                                                }
                                                else
                                                {

                                                    UserSchema.updateOne({ email : email } , {$set : {password  : hash}}).then((r6)=>{
                                                            if(r6.modifiedCount  == 1)
                                                            {

                                                                transporter.sendMail({
                                                                    from: '"MY-ECOM 👻" <webt5987@gmail.com>', // sender address
                                                                    to: email, // list of receivers
                                                                    subject: "Password Reset ", // Subject line
                                                                    text: "Password Reset ", // plain text body
                                                                    html: `<h1>Hi ${r1[0].name} !! Your Password is Reset Successfully Just Now </h1>`, // html body
                                                                  }).then((result_m)=>{
                                                                        if(result_m.hasOwnProperty('accepted') && result_m['accepted'].length > 0 && result_m['messageId'] !== null )
                                                                        {
                                                                            res.status(200).send({status : 200  , message :"Password Reset Successfully"})  

                                                                        }
                                                                        else
                                                                        {
                                                                            res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
                                                        
                                                                        }
                                                                  }).catch((err)=>{
                                                                    res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
                                                        
                                                                  })   
                                                            }
                                                            else{
                                                                res.status(400).send({status : 400  , message :"Something Went Wrong Try Again"})  

                                                            }
                                                    }).catch((err)=>{
                                                        res.status(500).send({status : 500  , message :"Something Went Wrong Try Again"})  

                                                    })
                                                }
                                            })
                                        }

                                    })


                            }
                    }
                    else
                    {
                        res.status(401).send({status : 401  , message :"OTP Didn't Match !!"})

                    }
                    
                  

                    


                }else
                {
                    res.status(400).send({status : 400  , message :"Something Went Wrong"})

                }
            }).catch((err)=>{
                console.log(err)
                res.status(500).send({status : 500  , message :"Something Went Wrong"})

            })
      }
      else
      {

        res.status(400).send({status : 400  , message :"Something Went Wrong"})

      }

   }).catch((err)=>{
    res.status(500).send({status : 500  , message :"Something Went Wrong"})

   })

}


exports.forgotPassword = (req,res)=>{
const {email} =  req.body;
var otp  =  Math.floor(Math.random() *  167899).toString().padStart(6,0)

UserSchema.find({email :  email}).then((result)=>{
    if(result.length > 0)
    {

        var uid  =  result[0]._id;


        OtpSchema.deleteOne({ uid : uid }).then((dres)=>{

            if(dres.deletedCount == 1)
            {

                transporter.sendMail({
                    from: '"MY-ECOM 👻" <webt5987@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Password Reset OTP", // Subject line
                    text: "OTP", // plain text body
                    html: `<h1>Hi ${result[0].name} !! Your Password Reset OTP is ${otp} </h1>`, // html body
                  }).then((result_m)=>{
                        if(result_m.hasOwnProperty('accepted') && result_m['accepted'].length > 0 && result_m['messageId'] !== null )
                        {
                            OtpSchema.insertMany({uid :  uid ,  otp :  otp ,  time : Number(new Date(Date.now())) }).then((result2)=>{
                                if(result2.length > 0)
                                {                    
                                    
                                    res.status(200).send({status : 200 , message  : "OTP Sent Successfully on your mail"})
        
        
                                }
                                else
                                {
                                    res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
        
                                }
                            }).catch((err)=>{
                                res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
        
                            })
                        }
                        else
                        {
                            res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
        
                        }
                  }).catch((err)=>{
                    res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
        
                  })
        

            }else
            {
                transporter.sendMail({
                    from: '"Fred Foo 👻" <webt5987@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Password Reset OTP", // Subject line
                    text: "OTP", // plain text body
                    html: `<h1>Hi ${result[0].name} !! Your Password Reset OTP is ${otp} </h1>`, // html body
                  }).then((result_m)=>{
                        if(result_m.hasOwnProperty('accepted') && result_m['accepted'].length > 0 && result_m['messageId'] !== null )
                        {
                            OtpSchema.insertMany({uid :  uid ,  otp :  otp ,  time : Number(new Date(Date.now())) }).then((result2)=>{
                                if(result2.length > 0)
                                {                    
                                    
                                    res.status(200).send({status : 200 , message  : "OTP Sent Successfully on your mail"})
        
        
                                }
                                else
                                {
                                    res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
        
                                }
                            }).catch((err)=>{
                                res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
        
                            })
                        }
                        else
                        {
                            res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
        
                        }
                  }).catch((err)=>{
                    res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})
        
                  })
        
            }

        }).catch((err)=>{
            res.status(500).send({status : 500 , message  : "Seomthing Went Wrong !! Try Again"})

        })


        
        

    }
    else
    {
        res.status(400).send({status : 400 , message  : "Email ID Not Registered"})
   
    }
})





}





exports.login =  (req,res) =>{
const {email , password} =  req.body;
UserSchema.find({email  : email}).then((result)=>{
    if(result.length > 0)
    {
        bcrypt.compare(password  ,result[0].password , function(err, status ){
            if(status == true)
            {
                res.status(200).send({status : 200 , message  : "Login Successfully"  , data : result[0]})

            }
            else
            {
                res.status(401).send({status : 401 , message  : "Incorrect Password"})

            }
        })
    }else
    {
        res.status(400).send({status : 400 , message  : "User Not Registred || Please Register First"})
    }
}).catch((err)=>{

    
    res.status(400).send({status : 400 , message  : "Somwthing Went Wrong Please Try Again"})

})

}


exports.addUser = (req,res)=>{
  const  {name , email , mobile , address , password , gender } =  req.body;
  bcrypt.genSalt(10,function(err, salt){
    if(err){
        console.log(err)
        res.status(500).send({status : 500 , message  : "Something Went Wrong Try Aagin"})
    }else{
        bcrypt.hash(password, salt ,  function(err, hash){
            if(err){
                console.log(err)
                res.status(500).send({status : 500 , message  : "Something Went Wrong Try Aagin"})
            }else{
                UserSchema.insertMany({name : name , email : email , mobile : mobile,  address  : address ,  password : hash ,  gender  : gender }).then((result)=>{
                    if(result.length >  0)
                    {
                        res.status(200).send({status : 200 , message  : "User Registered Successfully"})

                    }
                    else
                    {
                        res.status(500).send({status : 500 , message  : "Something Went Wrong Try Aagin"})

                    }
                }).catch((err)=>{
                    console.log(err)
                    if(err.code == 11000)
                    {
                        res.status(400).send({status : 400 , message  : `User Already Exists with these details : ${err.message.split("{")[1]}`})

                    }
                    else
                    {

                        res.status(500).send({status : 500 , message  : "Something Went Wrong Try Aagin"})
                    }

                })

            }
        })
    }
  })  



}
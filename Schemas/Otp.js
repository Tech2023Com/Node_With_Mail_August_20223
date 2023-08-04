const mongoose = require('mongoose');


const OtpSchema  =  new mongoose.Schema({

   uid : {
        type: String,
        required :  true
    },
    otp : {
        type  : String,
        required : true,
    },
    time :  {
        type  : Number,
        required : true,
    }
   



})

const OTP = mongoose.model('otp' ,  OtpSchema);
module.exports = OTP
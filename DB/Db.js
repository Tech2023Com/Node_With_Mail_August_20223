const mongoose = require('mongoose');

// const username = "bhanu";
// const password = "1KH4eZ7zSikDpYcC";
// const cluster = "cluster0.geoi9yb";
// const dbname = "July-ANB-DB";



// const uri = "mongodb+srv://bhanuchouhan021:<password>@cluster0.geoi9yb.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect('mongodb://localhost:27017/My-E-Com-2023' , {useNewUrlParser : true})

// mongoose.connect(
//     `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
//     {
//       useNewUrlParser: true,
//     //   useFindAndModify: false,
//       useUnifiedTopology: true
//     }
//   );

const db  =  mongoose.connection;


db.on('error' ,  function(){
    console.log('Something Went Wrong During Connection of Database')
})

db.once('open' ,  function(){
    console.log('Successfully Connected with MongoDB')
})

module.exports =  db
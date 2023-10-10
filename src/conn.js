const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Login_Tut",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("Database Connected");
}).catch((e)=>{
    console.log(e);
})

const authSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        required:true
    },
});

const auth = new mongoose.model('auth' , authSchema);

module.exports = auth;
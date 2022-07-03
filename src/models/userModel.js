const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(

    {
        title: {
            type : String,
            required : true,
            enum : ['mr', 'mrs', 'ms']

        },
        name : { 
            type : String,
            required : true

        },

        phone:{
            type: String,
            required : true,
            unique : true

        },
        email:{
            type: String,
            required: true,
            unique : true
        },
        password:{
            type : String,
            required : true,

        },
        address:{
            street: {type:String },
            city:   {type: String},
            pinCode:{type: Number}
        },
       
    },{timestamps:true}
)

module.exports = mongoose.model('sqb',userSchema)
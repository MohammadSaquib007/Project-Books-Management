const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema(
    {
        bookId:{
            type:ObjectId,
            required:true,
            refs:"BOOKS"
        },
        reviewedBy:{
            type:String,
            required:true,
            default:'guest'
            
        },
        reviewedAt :{
            type:Date,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        review:{
            type:String
        }

    },{timestamps:true}
)



module.exports = mongoose.model('msqb',reviewSchema)
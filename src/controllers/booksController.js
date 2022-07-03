const userModel = require("../models/userModel")
const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")

const valid = require("../validation/validation")


//---------------------createBooks(POST API)-------------

const createBook = async function (req, res) {
    try {
        const requestBody = req.body
       
        let { title, excerpt, userId, ISBN, category, subCategory, releasedAt } = requestBody

        if (!valid.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: true, msg: "pls provide request body" })
        }
        if (!valid.isValid(title)) {
            return res.status(400).send({ status: false, msg: "pls provide title for the book" })
        }
        const titleUsed = await booksModel.findOne({ title: title })
        if (titleUsed) {
            return res.status(400).send({ status: false.valueOf, msg: "This title is already Used" })
        }

        if (!valid.isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "pls write excerpt" })
        }
        if (!valid.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "pls provide userId" })
        }
        if (!valid.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "pls provide valid userId" })
        }

        if (!valid.isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "pls provide book  ISBN number" })
        }
        if (!valid.validateISBN(ISBN)) {
            return res.status(400).send({ status: false, msg: "Invalid  ISBN number" })
        }
        const isISBNAlreadyUsed = await booksModel.findOne({ ISBN: ISBN })
        if (isISBNAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "ISBN already register" })
        }
        if (!valid.isValid(category)) {
            return res.status(400).send({ status: false, msg: "pls provide category" })
        }
        if (!valid.isValid(subCategory)) {
            return res.status(400).send({ status: false, msg: "pls provide subcatgory" })
        }
        if (!valid.isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: " released date Mandatory" })
        }
      


        const validId = await userModel.findById({ _id: userId })
        if (!validId) {
            return res.status(400).send({ status: false, msg: "userId does not exist" })
        }

        const bookData = await booksModel.create({ title, excerpt, userId, ISBN, category, subCategory, releasedAt })
        return res.status(201).send({ status: true, msg: "created successfully", data: bookData })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}


//-------------------fetch----------------------


const getBook = async function (req, res) {

    try {


        const requestBody = req.body


        const { userId, category, subCategory } = requestBody

        if (!valid.isValid(requestBody)) {
            return res.status(400).send({ status: false, msg: " pls provide requestBody" })
        }

        if (req.query.userId || req.query.category || req.query.subCategory) {


            let userId = req.query.userId
            let category = req.query.category
            let subCategory = req.query.subCategory
            let obj = {}


            if (userId) {
                obj.userId = userId
            }

            if (category) {
                obj.category = category
            }

            if (subCategory) {
                obj.subCategory = subCategory
            }

            obj.isDeleted = false


            const gettingBooks = await booksModel.find(obj)
            if (!gettingBooks) {
                return res.status(404).send({ status: false, msg: " given details not found" })
            } else {
                return res.status(200).send({ status: true, msg: " fetching  data successfull ", data: gettingBooks })
            }
        }



    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}



//-------------------book Details With Review---------------------


const bookDetails = async function (req, res) {



    try {



        const reqBookId = req.params.bookId



        if (!valid.isValid(reqBookId)) {

            return res.status(404).send({ status: false, msg: "pls provide bookId" })

        }

        if (!valid.isValidObjectId(reqBookId)) {

            return res.status(404).send({ status: false, msg: "invalid bookId" })

        }

        let bookInfo = await booksModel.findOne({ _id: reqBookId, isDeleted: false })

        if (!bookInfo) {

            return res.status(404).send({ status: false, msg: "book not found" })

        }
        let reviewData = await reviewModel.find({ bookId: reqBookId, isDeleted: false })

        const responseData = bookInfo.toObject()

        responseData['review'] = reviewData



        return res.status(200).send({ status: true, msg: " fetching review data successfuly", data: responseData })



    } catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}


//---------------------------updateBook------------------------

const updateBook = async function (req, res) {
    try {

        const requestBody = req.body

        const reqBook = req.params.bookId
        let { title, excerpt, releasedAt, ISBN } = requestBody



        if (!valid.isValid(title)) {

            return res.status(400).send({ status: false, msg: "pls provide title for the book" })

        }
        if (!valid.isValid(excerpt)) {

            return res.status(400).send({ status: false, msg: "pls write excerpt" })

        }

        if (!valid.isValid(ISBN)) {

            return res.status(400).send({ status: false, msg: "pls provide book  ISBN number" })

        }
        let obj = {}

        if (title) {

            obj.title = title

        }

        if (excerpt) {

            obj.excerpt = excerpt

        }

        if (releasedAt) {

            obj.releasedAt = releasedAt

        }

        if (ISBN) {

            obj.ISBN = ISBN

        }



        obj.isDeleted = false
        const updating = await booksModel.findByIdAndUpdate({ _id: reqBook, isDeleted: false }, { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN }, { new: true })

        if (!updating) {

            return res.status(404).send({ status: false, msg: "book update process failed" })

        } else {

            return res.status(200).send({ status: true, msg: "book update successfully", data: updating })
        }

    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.msg })

    }

}


//-------------------delete Book-----------------

const removeBook = async function (req,res){
    try{
        const removeData = req.params.bookId
        if(!removeData){
            return res.status(404).send({status:false,msg :"pls provide book data"})
           
        } 
        await booksModel.findByIdAndDelete({_id:removeData,isDeleted:false})
        return res.status(200).send({status:true,msg :"book deleted successfully"})
    }
    catch (err) {

        return res.status(500).send({ status: false, msg: err.msg })

    }

}







module.exports = { createBook, getBook, bookDetails, updateBook ,removeBook}









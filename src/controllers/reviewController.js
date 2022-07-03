const reviewModel = require("../models/reviewModel")
const booksModel = require("../models/booksModel")
const valid = require("../validation/validation")


//------------------Review APIs-------------


const createReview = async function (req, res) {

    try {

        const requestBody = req.body

        const bookId = req.params.bookId
        if (!valid.isValidRequestBody(requestBody)) {

            return res.status(404).send({ status: false, msg: "pls provide review details" })

        }

        const bookInfo = await booksModel.findById({ _id: bookId, isDeleted: false });

        if (!valid.isValid(bookId)) {

            return res.status(404).send({ status: false, msg: "pls give book id" })

        }

        if (!valid.isValidObjectId(bookId)) {

            return res.status(404).send({ status: false, msg: "pls provide book id" })

        }
        if (!bookInfo) {

            return res.status(404).send({ status: false, msg: "pls provide valid bookId" }

            )

        }

        const { reviewedBy, reviewedAt, rating, review } = requestBody

        if (!valid.isValid(reviewedBy)) {

            return res.status(404).send({ status: false, msg: "pls give reviewer name" })

        }

        if (!valid.isValid(reviewedAt)) {

            return res.status(404).send({ status: false, msg: "" })

        }

        if (!valid.isValid(rating)) {

            return res.status(404).send({ statu: false, msg: "pls give rating" })

        }
        if(!valid.validateRating(rating)){
            return res.status(404).send({ statu: false, msg: "rating should be between 1 to 5 " })
        }

        if (!valid.isValid(review)) {

            return res.status(404).send({ status: false, msg: " pls write review" })

        }

        const reviewInfo = await reviewModel.create({

            bookId: bookId,

            reviewedBy: reviewedBy ? reviewedBy : "Guest",

            reviewedAt: reviewedAt,

            rating: rating,

            review: review

        })

        bookInfo.reviews = bookInfo.reviews + 1

        await bookInfo.save()
        const data = bookInfo.toObject()

        data['review'] = review

        return res.status(201).send({ status: true, msg: "created successfully", data: data })

    }



    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}

//-------------------update review-------------------


const updateReview = async function (req, res) {
    try {
        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        if (!valid.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: "invalid book id" })
            return
        }
        const book = await booksModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            res.status(400).send({ status: false, message: "book not found" })
            return
        }
        if (!valid.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: "pls provide a valid reviewId id" })
            return
        }

        const fetchReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!fetchReview) {
            res.status(400).send({ status: false, message: 'Review does not exists' })
            return
        }
        const data = book.toObject()
        data['reviewsData'] = fetchReview

        if (!valid.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'No paramateres passed. Review unmodified', data: data })
        }

        const { reviewedBy, review, rating } = requestBody;
        updatedReviewData = {}

        if (valid.isValid(reviewedBy)) {
            updatedReviewData['reviewedBy'] = reviewedBy.trim()
        }

        if (!valid.isValid(rating)) {
            if (!valid.validateRating(rating)) {
                res.status(400).send({ status: false, message: 'rating should be between 1 to 5 integers' })
                return
            }
            updatedReviewData['rating'] = rating
        }

        if (valid.isValid(review)) {
            updatedReviewData['review'] = review
        }

        const updateReview = await reviewModel.findOneAndUpdate(fetchReview, updatedReviewData, { new: true })

        data['reviewsData'] = updateReview

        res.status(200).send({ status: true, message: 'review updated successfully', data: data });

    } catch (err) {
        res.status(500).send({ status: false, message: e.message })
    }
}


//--------------delete review-----------------

const removeReview = async function (req, res) {

    try {

        const bookId = req.params.bookId

        const reviewId = req.params.reviewId
        const book = await booksModel.findOne({ id: bookId, isDeleted: false })

        if (!book) {

            res.status(400).send({ status: false, message: "invalid book id" })
            return

        }


        if (!valid.isValidObjectId(bookId)) {

            res.status(400).send({ status: false, message: "invalid book id" })



            return

        }
        if (!valid.isValidObjectId(reviewId)) {



            res.status(400).send({ status: false, message: "pls provide a valid reviewId id" })
            return
        }



        if (!reviewId) {

            return res.status(404).send({ status: false, msg: "pls provide valid review Id" })
        }
        await reviewModel.findByIdAndDelete({ _id: reviewId, isDeleted: false })
        return res.status(200).send({ status: true, msg: "Review deleted successfully" })

    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}


module.exports = { createReview, updateReview, removeReview }
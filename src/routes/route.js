const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const booksController = require('../controllers/booksController')
const reviewController = require('../controllers/reviewController')
const middleware = require('../middleware/middleware.js')





//---------------------userApi--------------------------
router.post('/userCreation',userController.userCreation)
router.post('/login',userController.login)

//---------------------bookApi --------------------

router.post('/createBook',booksController.createBook)
router.get('/fetch',booksController.getBook)
router.get('/books/:bookId',booksController.bookDetails)
router.put('/update/:bookId',middleware,booksController.updateBook)
router.delete('/deleted/:bookId',middleware,booksController.removeBook)


//------------------reviewApi-----------------------------
router.post('/create/:bookId/review',reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewController.removeReview)


module.exports = router

const userModel = require('../models/userModel')
const validate = require('../validation/validation')
const jwt = require('jsonwebtoken')

//-------------------------------create User------------------------------------

const userCreation = async function (req, res) {
    try {
        const requestBody = req.body

        let { title, name, phone, email, password, address } = requestBody
        if (!validate.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: 'pls provide request body' })
        }
        if (!validate.isValid(title)) {
            return res.status(400).send({ status: false, mag: 'pls provide title' })
        }
        if (!validate.isValidtitle(title)) {
            return res.status(400).send({ status: false, msg: 'pls provide valid title' })
        }
        if (!validate.isValid(name)) {
            return res.status(400).send({ status: false, msg: 'pls provide name' })
        }
        if (!validate.isValid(phone)) {
            return res.status(400).send({ status: false, msg: 'pls provide phone number' })
        }
        if (!validate.isValidPhone(phone)) {
            return res.status(400).send({ status: false, msg: 'pls provide valid phone no' })
        }
        if (!validate.isValid(email)) {
            return res.status(400).send({ status: false, msg: 'pls provide email id ' })
        }
        if (!validate.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: 'pls provide valid email' })
        }
        const isEmailAlreadyused = await userModel.findOne({ email: email })
        if (isEmailAlreadyused) {
            return res.status(400).send({ status: false, msg: 'email is already used' })
        }
        if (!validate.isValid(password)) {
            return res.status(400).send({ status: false, msg: "pls provide password" })
        }
        if (!validate.validatePassword(password)) {
            return res.status(400).send({ status: false, msg: "pls provide strong password" })
        }
        if (!validate.isValid(address)) {
            return res.status(400).send({ statuas: false, msg: 'pls provide address' })
        }
        if (!validate.isValid(address.street)) {
            return res.status(400).send({ status: false, msg: "pls provide street" })
        }
        if (!validate.isValid(address.city)) {
            return res.status(400).send({ status: false, msg: "pls provide city" })
        }
        if (!validate.isValid(address.pinCode)) {
            return res.status(400).send({ status: false, msg: "pls provide pin code" })
        }
        let createData = await userModel.create(requestBody)
        return res.status(201).send({ status: true, msg: 'user id created succsesfully', data: createData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.msg })
    }


}



//--------------------------Login Api--------------------------

const login = async function (req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        if (!validate.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "pls provide valid email" })
        }
        if (!validate.validatePassword(password)) {
            return res.status(400).send({ status: false, msg: "pls provide strong password" })
        }
        if (email && password) {
            const userPassword = await userModel.findOne({ email: email, password: password })

        
        if (userPassword) {
            const token = jwt.sign({ createUser: userPassword._id }, 'lementis')
            return res.status(201).send({ status: true, token: token })
        }
        }
        else {
            return res.status(400).send({ status: false, msg: "invalid credential" })
        }

    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.msg })

    }


}

module.exports =  { userCreation, login } 

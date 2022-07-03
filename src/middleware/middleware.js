const jwt = require('jsonwebtoken')
const userAuth = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']
        if (!token) {
            return res.status(403).send({ status: false, message: 'missing authentication token in request' })
        }
        let decoded = await jwt.verify(token, 'lementis')
        if (!decoded) {
            return res.status(403).send({ status: false, message: 'invalid authentication token in request' })
        }
        req.userId = decoded.userId
        next()

    }
    catch (err) {
       return res.status(500).send({ status: false, message: err.message })
    }

}


module.exports = userAuth
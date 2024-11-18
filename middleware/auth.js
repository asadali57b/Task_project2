
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) return res.status(401).send("Access denied. No token provided.");
    const splitToken = token.split(' ')[1];

    try {
        const decoded = jwt.verify(splitToken, 'userData');
        req.user = decoded;  
        const id=req.user._id
        console.log(id);

        next();  
    } catch (ex) {
        if (ex.name === 'TokenExpiredError') {
            return res.status(400).send("Token expired");
        } else if (ex.name === 'JsonWebTokenError') {
            return res.status(400).send("Invalid token");
        } else {
            return res.status(400).send("Token verification failed");
        }
    }
}

module.exports = auth;
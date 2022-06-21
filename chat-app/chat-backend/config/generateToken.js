const jwt = require('jsonwebtoken');

//Generate Token

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY,{
        expiresIn:'30d'
    })
}

module.exports=generateToken
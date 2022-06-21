const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyUser = async (req, res, next)=> {
    let token;
  
    if(req.headers.authorization &&
       req.headers.authorization.startsWith('Bearer'))
       {
      try {
        //Get Token
        token = req.headers.authorization.split(' ')[1];
  
        //Verify token
  
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        //Get user from the token
  
        req.user = await User.findById(decode.id).select('-password')
        next()
      } catch (error) {
        console.log(error);
        res.status(401).json({message:"Not authorised"})
      }
      
    }
    if(!token){
      res.status(401).json({message:"Provide token in header"})
    }
  
  }
  module.exports = {verifyUser}
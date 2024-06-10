const jwt = require('jsonwebtoken')
const User = require('../models/User')


exports.auth = async (req, res, next) => {
    try{

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, "grooveix")
        let user = await User.findOne({_id:decoded._id, token})
        
        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        
        next()
        
    }
    catch(e){
        res.status(401).send({error: "Please authenticate...!!!"})
    }
}

exports.adminAuth = async (req, res, next) => {
    try{

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, "grooveix")
        let user = await User.findOne({_id:decoded._id, token})
         
        if(!user){
            throw new Error("Please authenticate...!!!")
        }

        if(user.userType!=="admin"){
            throw new Error("Access Forbidden...!!!")
        }

        req.token = token
        req.user = user
        
        next()
        
    }
    catch(e){
        res.status(401).send({error: e.message})
    }
}


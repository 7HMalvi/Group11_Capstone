const User = require('../models/User')
const bcrypt = require('bcryptjs');


exports.userSignup= async (req,res) => {
    
    try{

        let user = await User.findOne({email: req.body.email})
        if(user){
            throw new Error("User with this email already exist. Please use different one !!")
        }

        user = new User(req.body)
        await user.save()

        const token = await user.generateAuthToken()
        res.status(201).send({user, token})

    }catch(error){
        res.send({error: error.message})
    }
    
}


exports.userLogin= async (req,res) => {

    try{

        const user = await User.findOne({email: req.body.email})
        if(!user){
            throw new Error('There is no account with given email address. Please register first to login !')
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            throw new Error("The entered password is incorrect")
        }

        const token = await user.generateAuthToken()
        res.status(201).send({user, token})

    }catch(error){
        res.send({error: error.message})
    }

}


exports.userLogout = async(req, res) =>{

    try{

        const user = await User.findById(req.user._id);
        if(!user){
            throw new Error('There is no account with given email address. Please register first to login !')
        }

        await User.findByIdAndUpdate(req.user._id,{token: null})
        res.status(200).send()

    }catch(error){
        res.send({error: error.message})
    }

}
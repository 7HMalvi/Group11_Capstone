const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Song = require('../models/Song');


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

exports.getUserList = async (req,res) => {
    
    try{

        if(req.user.userType!=="admin"){
            throw new Error("Access Forbidden...!!!")
        }

        let users = await User.find({userType: "user"})
        if(users.length===0){
            throw new Error("No users exists")
        }

        res.status(201).send({users})

    }catch(error){
        res.send({error: error.message})
    }
    
}

exports.editUser = async (req,res) => {
    
    try{

        if(req.user.userType!=="admin"){
            throw new Error("Access Forbidden...!!!")
        }

        let user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!user){
            throw new Error("No user exists")
        }
        res.status(201).send({user})

    }catch(error){
        res.send({error: error.message})
    }
    
}

exports.deleteUser = async (req,res) => {
    
    try{

        if(req.user.userType!=="admin"){
            throw new Error("Access Forbidden...!!!")
        }

        let user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            throw new Error("No user exists")
        }
        
        res.status(201).send({user})

    }catch(error){
        res.send({error: error.message})
    }
    
}

exports.cardDetails = async (req,res) => {
    
    try{

        if(req.user.userType!=="admin"){
            throw new Error("Access Forbidden...!!!")
        }

        let noOfUsers = await User.find({userType: 'user'}).count();
        let noOfSongs = await Song.find({}).count();
        let noOfArtists = 0;
        let noOfGeneres = 0;
        
        res.status(201).send({
            noOfUsers,
            noOfSongs,
            noOfArtists,
            noOfGeneres
        })

    }catch(error){
        res.send({error: error.message})
    }
    
}


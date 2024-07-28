const User = require('../models/User')



exports.getUserList = async (req,res) => {
    
    try{

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

        let noOfUsers = await User.find({userType: 'user'}).count();
        let noOfSongs = 0;
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
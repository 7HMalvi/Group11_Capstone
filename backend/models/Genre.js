const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User'
    }
},
{
    timestamps: { 
        createdAt: true, 
        updatedAt: true 
    }
})


const Genre = mongoose.model('Genre', genreSchema)

module.exports = Genre;
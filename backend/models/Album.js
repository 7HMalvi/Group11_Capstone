const mongoose = require('mongoose');


const albumSchema = new mongoose.Schema({

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


const Album = mongoose.model('Album', albumSchema)

module.exports = Album;
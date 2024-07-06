const fs = require('fs-extra');
const path = require('path');
const mongoose = require('mongoose');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Genre = require('../models/Genre');

const findOrCreate = async (Model, value) => {
    if (mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(value);
    } else {
        const existing = await Model.findOne({ name: value });
        if (existing) return existing._id;

        const newDoc = new Model({ name: value });
        await newDoc.save();

        return newDoc._id;
    }
};

exports.addSong = async (req, res) => {
    
    try{

        if (!req?.files?.song) {
            return res.status(400).send({ error: 'Song file is required.' });
        }

        const { albums, artists, genres } = req.body;
        let payLoad = req.body;

        if(req?.files?.song && req?.files?.song[0]){
            payLoad = {
                ...payLoad,
                file: req.files.song[0].path.replace("audio\\","/audio/"),
            }
        }

        if(req?.files?.coverImage && req?.files?.coverImage[0]){
            payLoad = {
                ...payLoad,
                coverImage: req.files.coverImage[0].path.replace("photo\\","/photo/"),
            }
        }

        const processedAlbums = await Promise.all(albums.map(album => findOrCreate(Album, album)));
        const processedArtists = await Promise.all(artists.map(artist => findOrCreate(Artist, artist)));
        const processedGenres = await Promise.all(genres.map(genre => findOrCreate(Genre, genre)));

        const newSong = new Song({
            ...payLoad,
            albums: processedAlbums,
            artists: processedArtists,
            genres: processedGenres,
            addedBy: req.user._id
        });
        await newSong.save();

        const song = await Song.findById(newSong._id)
            .populate('artists')
            .populate('albums')
            .populate('genres')
            .populate('addedBy', 'firstName lastName');

        res.status(201).send({ message: 'Song added successfully!', song });

    }catch(error){
        res.send({error: error.message})
    }
    
}

exports.updateSong = async (req,res) => {
    
    try{

        let newData = req.body;

        let song = await Song.findById(req.params.id);
        if(!song){
           throw new Error("Song not found!"); 
        }

        if(req?.files?.song && req?.files?.song[0]){
            if (fs.existsSync(song.file)) {
                fs.unlinkSync(song.file);
            }
            newData = {
                ...newData,
                file: req.files.song[0].path,
            }
        }
        if(req?.files?.coverImage && req?.files?.coverImage[0]){
            if (fs.existsSync(song.coverImage) && song.coverImage!=="/photo/Default_Cover_Image.png") {
                fs.unlinkSync(song.coverImage);
            }
            newData = {
                ...newData,
                file: req.files.coverImage[0].path,
            }
        }

        const processedAlbums = await Promise.all(req.body.albums.map(album => findOrCreate(Album, album)));
        const processedArtists = await Promise.all(req.body.artists.map(artist => findOrCreate(Artist, artist)));
        const processedGenres = await Promise.all(req.body.genres.map(genre => findOrCreate(Genre, genre)));

        newData = {
            ...newData,
            albums: processedAlbums,
            artists: processedArtists,
            genres: processedGenres,
        }

        song = await Song.findByIdAndUpdate(
            req.params.id,
            newData,
            {new: true}
        );


        if(!song){
           throw new Error("Song not found!"); 
        }

        song = await Song.findById(song._id)
            .populate('artists')
            .populate('albums')
            .populate('genres')
            .populate('addedBy', 'firstName lastName');

        res.status(201).send({ message: 'Song updated successfully!', song });


    }catch(error){
        res.send({error: error.message})
    }
    
}

exports.getSong = async (req,res) => {
    
    try{

        const song = await Song.findById(req.params.id)
            .populate('artists')
            .populate('albums')
            .populate('genres')
            .populate('addedBy', 'firstName lastName');

        if(!song){
           throw new Error("Song not found!"); 
        }

        console.log("song...", song);

        res.status(201).send({ message: 'Song fetched successfully!', song });

    }catch(error){
        res.send({error: error.message})
    }
    
}

exports.deleteSong = async (req,res) => {
    
    try{

        const song = await Song.findByIdAndDelete(req.params.id);
        if(!song){
           throw new Error("Song not found!"); 
        }

        if (fs.existsSync(song.file)) {
            fs.unlinkSync(song.file);
        }
        if (fs.existsSync(song.coverImage) && song.coverImage!=="/photo/Default_Cover_Image.png") {
            fs.unlinkSync(song.coverImage);
        }

        res.status(201).send({ message: 'Song deleted successfully!', song });

    }catch(error){
        res.send({error: error.message})
    }
    
}

const sendFile = (res, filePath) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({ error: 'File not found' });
        }
        res.sendFile(path.resolve(filePath));
    });
};

exports.getSongFile = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return new Error('Song not found');
        }
        sendFile(res, song.file);
    } catch (error) {
        res.send({error: error.message})
    }
};

exports.getCoverImage = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return new Error('Song not found');
        }
        sendFile(res, song.coverImage);
    } catch (error) {
        res.send({error: error.message})

    }
};

exports.getSongList = async (req, res) => {
    try {
        const { search, artists, albums, genres, addedby } = req.body;

        let filter = {};
        let aggregateArray = [];

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        if (artists && artists.length > 0) {
            filter.artists = { $in: artists.map(id => mongoose.Types.ObjectId(id)) };
        }

        if (albums && albums.length > 0) {
            filter.albums = { $in: albums.map(id => mongoose.Types.ObjectId(id)) };
        }

        if (genres && genres.length > 0) {
            filter.genres = { $in: genres.map(id => mongoose.Types.ObjectId(id)) };
        }

        if (addedby) {
            filter.addedBy = mongoose.Types.ObjectId(addedby);
        }

        aggregateArray.push({ $match: filter });

        aggregateArray.push(
            { $lookup: { from: 'artists', localField: 'artists', foreignField: '_id', as: 'artists' } },
            { $lookup: { from: 'albums', localField: 'albums', foreignField: '_id', as: 'albums' } },
            { $lookup: { from: 'genres', localField: 'genres', foreignField: '_id', as: 'genres' } },
            { $lookup: { from: 'users', localField: 'addedBy', foreignField: '_id', as: 'addedBy' } },
            { $unwind: { path: '$addedBy', preserveNullAndEmptyArrays: true } }
        );

        // const skip = (pageno - 1) * pagesize;
        // aggregateArray.push({ $skip: skip });
        // aggregateArray.push({ $limit: pagesize });
        aggregateArray.push({ $sort: {createdAt: -1} });

        const songs = await Song.aggregate(aggregateArray);

        res.status(200).send({ songs });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

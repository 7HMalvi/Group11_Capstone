const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Genre = require('../models/Genre');


exports.getArtists = async (req, res) => {
    try {
        let search = req.body.search || '';

        let artists;
        if (search) {
            artists = await Artist.aggregate([
                {
                    $match: { name: { $regex: search, $options: 'i' } }
                },
                {
                    $addFields: {
                        matchType: {
                            $cond: [
                                { $eq: ["$name", search] }, 0,
                                {
                                    $cond: [
                                        { $regexMatch: { input: "$name", regex: `^${search}`, options: 'i' } }, 1,
                                        2
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $sort: {
                        matchType: 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        value: "$_id",
                        label: "$name"
                    }
                }
            ]);
        } else {
            artists = await Artist.aggregate([
                {
                    $project: {
                        _id: 0,
                        value: "$_id",
                        label: "$name"
                    }
                },
                {
                    $sort: { name: 1 }
                }
            ]);
        }

        res.status(201).send({ data: artists });

    } catch (error) {
        res.send({ error: error.message });
    }
};


exports.getAlbums = async (req, res) => {
    try {
        let search = req.body.search || '';

        let albums;
        if (search) {
            albums = await Album.aggregate([
                {
                    $match: { name: { $regex: search, $options: 'i' } }
                },
                {
                    $addFields: {
                        matchType: {
                            $cond: [
                                { $eq: ["$name", search] }, 0,
                                {
                                    $cond: [
                                        { $regexMatch: { input: "$name", regex: `^${search}`, options: 'i' } }, 1,
                                        2
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $sort: {
                        matchType: 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        value: "$_id",
                        label: "$name"
                    }
                }
            ]);
        } else {
            albums = await Album.aggregate([
                {
                    $project: {
                        _id: 0,
                        value: "$_id",
                        label: "$name"
                    }
                },
                {
                    $sort: { name: 1 }
                }
            ]);
        }

        res.status(201).send({ data: albums });

    } catch (error) {
        res.send({ error: error.message });
    }
};

exports.getGenres = async (req, res) => {
    try {
        let search = req.body.search || '';

        let genres;
        if (search) {
            genres = await Genre.aggregate([
                {
                    $match: { name: { $regex: search, $options: 'i' } }
                },
                {
                    $addFields: {
                        matchType: {
                            $cond: [
                                { $eq: ["$name", search] }, 0,
                                {
                                    $cond: [
                                        { $regexMatch: { input: "$name", regex: `^${search}`, options: 'i' } }, 1,
                                        2
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $sort: {
                        matchType: 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        value: "$_id",
                        label: "$name"
                    }
                }
            ]);
        } else {
            genres = await Genre.aggregate([
                {
                    $project: {
                        _id: 0,
                        value: "$_id",
                        label: "$name"
                    }
                },
                {
                    $sort: { name: 1 }
                }
            ]);
        }

        res.status(201).send({ data: genres });

    } catch (error) {
        res.send({ error: error.message });
    }
};
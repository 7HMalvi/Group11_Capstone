const { Router } = require("express");
const { auth } = require("../middleware/auth");
const { 
    getAlbums, getArtists, getGenres
} = require("../controllers/dataController");



const dataRouter = Router();



/* Data */
dataRouter.post("/getalbums", auth, getAlbums);
dataRouter.post("/getartists", auth, getArtists);
dataRouter.post("/getgenres", auth, getGenres);



module.exports = dataRouter;
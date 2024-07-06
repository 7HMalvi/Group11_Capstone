const { Router } = require("express");
const { auth } = require("../middleware/auth");
const { upload } = require("../utils/multer");
const {
    addSong, updateSong, deleteSong, getSong, getSongFile, getCoverImage, getSongList
} = require("../controllers/songController");



const songRouter = Router();


/* Song */
songRouter.post("/addsong", auth, upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), addSong);
songRouter.post("/updatesong/:id", auth, upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), updateSong);
songRouter.get("/song/:id", auth, getSong);
songRouter.delete("/deletesong/:id", auth, deleteSong);
songRouter.get("/getsongfile/:id", auth, getSongFile);
songRouter.get("/getcoverimage/:id", auth, getCoverImage);
songRouter.post("/getsonglist", auth, getSongList);


module.exports = songRouter;
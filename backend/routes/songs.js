const router = require("express").Router();
const multer = require("multer");
const path = require("path");
let Song = require("../models/Songs");
const { Error } = require("mongoose");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        let folder = "uploads/";

        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
            folder += "images/";
        }
        else if (ext === '.mp3' || ext === '.wav' || ext === '.aac' || ext === '.ogg' || ext === '.mpeg') {
            folder += "audio/";
        }
        else {
            return cb(new Error("Unsupported file type"), false);
        }

        cb(null, folder);
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const uploads = multer({ storage });

// add song
router.route("/add").post(uploads.fields([{ name: "audio", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), async (req, res) => {

    try {
        const { song, singer, lyrics, music, releasedOn, category } = req.body;


        const image = req.files["coverImage"] ? req.files["coverImage"].map(file => ({
            path: file.path,
            contentType: file.mimetype,
            filename: file.filename

        })) : [];

        const audio = req.files["audio"] && req.files["audio"][0] ? {
            path: req.files["audio"][0].path,
            contentType: req.files["audio"][0].mimetype,
            filename: req.files["audio"][0].filename

        } : null;


        const newSong = new Song({ song, singer, lyrics, music, releasedOn, category, image, audio });

        await newSong.save();
        res.json("New song is added.");

    }
    catch (e) {
        console.log(e);
        res.status(400).json("error : " + e);
    }
});


// view data - Admin table
router.route("/").get( async (req, res) => {

    try{
        const songList = await Song.find( {}, {"song": 1, "singer": 1, "category": 1});
        res.json(songList);
    }
    catch(e){
        console.log(e);
        res.status(500).json({message : "Internal server error"});
    }
});

//view song - userDash
router.route("/getUser").get( async (req, res) => {

    try{
        const songListUser = await Song.find( {}, {"song": 1, "singer": 1, "image": 1});
        res.json(songListUser);
    }
    catch(e){
        console.log(e);
        res.status(500).json({message : "Internal server error"});
    }
});

// view song - play music page
router.route("/getMusicplay/:id").get( async (req, res) => {

    try{
        const playsongId = req.params.id;
        const playSong = await Song.findById( playsongId, {"song": 1, "singer": 1, "audio": 1, "category": 1, "lyrics": 1, "music": 1});
        res.json(playSong);
    }
    catch(e){
        console.log(e);
        res.status(500).json({message : "Internal server error"});
    }
});

// delete song
router.route("/delete/:id").delete( async (req, res) => {

    try{
        let songId = req.params.id;
        const delSong = await Song.findByIdAndDelete(songId);
        res.json(delSong);    
    }
    catch(e){
        console.log(e);
        res.status(500).json({message : "Internal server error"});
    }

});




module.exports = router;
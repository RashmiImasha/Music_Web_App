const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({

    song :  {
        type : String,
        required : true
    },
    singer : {
        type : String,
        required : true
    },
    lyrics : {
        type : String,
        required : true
    },
    music : {
        type : String,
        required : true
    },
    releasedOn : {
        type : Date,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    image : [{
        filename : {
            type : String,
            required : true
        } 
    }],

    audio : {
        data : Buffer,
        contentType : String,
        filename : String
    }    
    
})

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
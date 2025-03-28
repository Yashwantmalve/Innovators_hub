const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


let teacherSchema = new mongoose.Schema({
    email:{
        type:String
    }
})

teacherSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("teacher",teacherSchema);


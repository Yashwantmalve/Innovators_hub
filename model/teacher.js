const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const student = require('./student');


let teacherSchema = new mongoose.Schema({
    email:{
        type:String
    },
    students:[{
        type:mongoose.Schema.ObjectId,
        ref:"student"
    }]
})

teacherSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("teacher",teacherSchema);


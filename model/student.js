const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    class: { type: String, required: true },
    email: {
        type: String,
        required: true,
    },
    attendance: [{ date: String }],
    performance: [{ subject: String, score: Number }],
})


module.exports = mongoose.model("student",studentSchema);
  
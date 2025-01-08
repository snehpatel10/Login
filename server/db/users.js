const mongoose = require('mongoose') 
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profilePic:{ 
        type:String,
        default: ''
    }
})

module.exports = mongoose.model('User', userSchema)

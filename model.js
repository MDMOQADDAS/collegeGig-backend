const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/cgig").then(
    ()=>{console.log("Connected with the database....")}
).catch(()=>{console.log("Connection fail  with database...")})

const userschema ={
    name: {
        type: String,
        required: [true, "Name can't be optional"]
    },
    email: {
        type: String,
        required: [true, "Email can't be optional"]
    },
    password: {
        type: String,
        required: [true, "Password can't be optional"]
    }
}

const postschema = {
    title:{
        type: String,
        required: [true, "title is mandotry"]
    },
    description: {
        type: String,
        require: [true, "description is mandotry"]
    }
}

const userSchema = new mongoose.Schema(userschema);
const postSchema = new mongoose.Schema(postschema);

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { User, Post };
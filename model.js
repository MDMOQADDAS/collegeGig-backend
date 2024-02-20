const mongoose = require("mongoose");

mongoose.connect(`mongodb://${process.env.MONGODB_URL}/cgig`).then(
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
    name:{
        type: String,
        required: [true, "name is mandotry"]
    },
    title:{
        type: String,
        required: [true, "title is mandotry"]
    },
    description: {
        type: String,
        require: [true, "description is mandotry"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is mandatory']
      },
      mediaUrl: {
        type: String,
        required: [true, 'Media URL is mandatory']
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
}

const userSchema = new mongoose.Schema(userschema);
const postSchema = new mongoose.Schema(postschema);

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { User, Post };

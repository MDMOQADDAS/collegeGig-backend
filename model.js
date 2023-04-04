const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/cgig").then(
    ()=>{console.log("Connected with the database....")}
).catch(()=>{console.log("Connection fail  with database...")})

const schema ={
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

const postSchema = mongoose.Schema(schema);

module.exports = mongoose.model('User', postSchema);